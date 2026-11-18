import React, { useState, useEffect } from 'react';

// Na het aanmelden: betalen met de eigen Tikkie, en zodra die binnen is de
// QR-code waarmee je op het festivalkantoor je speldje ophaalt (18-11-2026).
//
// Twee plekken gebruiken dit: direct onder het formulier (de Tikkie opent in
// een nieuw tabblad, want de pagina draait in een iframe; kom je terug, dan
// staat hier je QR-code) en de pagina /qr/<token>, waar de link uit de mail en
// de QR-code zelf naartoe gaan.
//
// De backend vraagt Tikkie zelf of er betaald is; deze pagina vraagt alleen
// steeds de stand op. Ophalen per post? Dan geen QR-code.

const API_URL = 'https://backend.cafetheaterfestival.nl';
const VASTE_TIKKIE = 'https://tikkie.me/pay/CTF/ncomtUKWVk5WVWg75LE2Ln';
const ELKE_MS = 4000;
const HOOGSTENS_MS = 45 * 60 * 1000;

const TEKST = {
    nl: {
        laden: 'Even kijken…',
        fout: 'Deze link klopt niet of is niet meer geldig.',
        aangemeld: 'Aanmelding geslaagd!',
        betaalUitleg: 'Bedankt voor je aanmelding! Betaal je bijdrage met de Tikkie hieronder.',
        betaalKnop: 'Betaal via Tikkie',
        nieuwTabblad: '(Opent in een nieuw tabblad)',
        wachten: 'We wachten op je betaling. Zodra die binnen is, verschijnt hier je QR-code.',
        wachtenPost: 'We wachten op je betaling. Zodra die binnen is, zie je het hier.',
        gestopt: 'We hebben je betaling nog niet gezien. Heb je net betaald? Ververs deze pagina dan over een minuut, of kijk in je mail.',
        betaald: 'Betaald, dank je wel!',
        welkom: (n) => (n ? `Welkom als Stamgast, ${n}!` : 'Welkom als Stamgast!'),
        qrUitleg: 'Laat deze QR-code zien op het festivalkantoor, dan krijg je je speldje mee. Je krijgt hem ook per mail.',
        perPost: 'Je speldje komt per post. Je krijgt nog een bevestiging per mail.',
        opgehaald: 'Je hebt je speldje al opgehaald. Veel plezier op het festival!',
        onbekend: 'Laat deze QR-code zien op het festivalkantoor, dan krijg je je speldje mee.',
        nogBetalen: 'Nog niet betaald? Dat kan via',
        dezeLink: 'deze link',
        qrAlt: 'QR-code voor je stamgastspeldje',
    },
    en: {
        laden: 'One moment…',
        fout: 'This link is not valid (anymore).',
        aangemeld: 'Registration successful!',
        betaalUitleg: 'Thank you for signing up! Please pay your contribution with the Tikkie below.',
        betaalKnop: 'Pay via Tikkie',
        nieuwTabblad: '(Opens in a new tab)',
        wachten: 'Waiting for your payment. As soon as it is in, your QR code appears here.',
        wachtenPost: 'Waiting for your payment. As soon as it is in, you will see it here.',
        gestopt: 'We have not seen your payment yet. Just paid? Refresh this page in a minute, or check your email.',
        betaald: 'Paid, thank you!',
        welkom: (n) => (n ? `Welcome as a Stamgast, ${n}!` : 'Welcome as a Stamgast!'),
        qrUitleg: 'Show this QR code at the festival office to collect your pin. You will also receive it by email.',
        perPost: 'Your pin will be sent by post. You will receive a confirmation by email.',
        opgehaald: 'You have already collected your pin. Enjoy the festival!',
        onbekend: 'Show this QR code at the festival office to collect your pin.',
        nogBetalen: 'Not paid yet? You can do so via',
        dezeLink: 'this link',
        qrAlt: 'QR code for your Stamgast pin',
    },
};

export default function Betaalstatus({ token, tikkieUrl = null, taal = 'nl', naAanmelding = false }) {
    const t = TEKST[taal] || TEKST.nl;
    const [stand, setStand] = useState(null);
    const [fout, setFout] = useState(null);
    const [gestopt, setGestopt] = useState(false);

    useEffect(() => {
        let weg = false;
        let timer = null;
        const begin = Date.now();

        const vraag = async () => {
            try {
                const r = await fetch(`${API_URL}/api/public/stamgast/status/${encodeURIComponent(token)}`, {
                    headers: { Accept: 'application/json' },
                });
                if (r.status === 404) throw new Error('weg');
                if (!r.ok) throw new Error('even niet');
                const d = await r.json();
                if (weg) return;
                setStand(d);
                setFout(null);
                // Klaar met wachten als er betaald is, of als we het nooit
                // te weten komen (aanmelding zonder eigen Tikkie).
                if (d.betaald || !d.betaling_bekend) return;
            } catch (e) {
                if (weg) return;
                if (e.message === 'weg') { setFout(t.fout); return; }
                // Netwerk hapert: gewoon opnieuw proberen.
            }
            if (Date.now() - begin > HOOGSTENS_MS) { setGestopt(true); return; }
            timer = setTimeout(vraag, ELKE_MS);
        };
        vraag();

        // Terug uit het Tikkie-tabblad: meteen kijken in plaats van wachten.
        const zichtbaar = () => {
            if (document.visibilityState === 'visible' && !weg) {
                clearTimeout(timer);
                setGestopt(false);
                vraag();
            }
        };
        document.addEventListener('visibilitychange', zichtbaar);

        return () => { weg = true; clearTimeout(timer); document.removeEventListener('visibilitychange', zichtbaar); };
    }, [token, t.fout]);

    if (fout) {
        return <div className="p-6 mt-6 rounded-lg text-center bg-red-50 border border-red-200 text-red-700">{fout}</div>;
    }
    if (!stand) {
        return <div className="p-6 mt-6 text-center text-gray-500">{t.laden}</div>;
    }

    const betaalLink = stand.tikkie_url || tikkieUrl;
    const klaar = stand.betaald || !stand.betaling_bekend;

    if (!klaar) {
        return (
            <div className="p-6 mt-6 rounded-lg text-center bg-green-50 border border-green-200">
                <h3 className="text-2xl font-bold text-green-700 mb-4">🎉 {t.aangemeld}</h3>
                <p className="text-gray-700 mb-8 text-lg">{t.betaalUitleg}</p>
                {betaalLink && (
                    <>
                        <a
                            href={betaalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block py-4 px-8 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
                        >
                            {t.betaalKnop}
                        </a>
                        <p className="text-gray-500 text-sm mt-4">{t.nieuwTabblad}</p>
                    </>
                )}
                <p className="text-gray-600 mt-8 flex items-center justify-center gap-2">
                    {!gestopt && <span className="inline-block w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />}
                    {gestopt ? t.gestopt : (stand.met_qr ? t.wachten : t.wachtenPost)}
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 mt-6 rounded-lg text-center bg-green-50 border border-green-200">
            {stand.betaald && <p className="text-green-700 font-semibold mb-2">✓ {t.betaald}</p>}
            <h3 className="text-2xl font-bold text-green-700 mb-4">🎉 {t.welkom(stand.voornaam)}</h3>

            {stand.speldje_opgehaald ? (
                <p className="text-gray-700 text-lg">{t.opgehaald}</p>
            ) : stand.met_qr ? (
                <>
                    <p className="text-gray-700 text-lg mb-6">{stand.betaald ? t.qrUitleg : t.onbekend}</p>
                    {stand.qr_url && (
                        <img src={stand.qr_url} alt={t.qrAlt} width="240" height="240" className="mx-auto w-60 h-60 bg-white p-2 rounded-lg border border-gray-200" />
                    )}
                </>
            ) : (
                <p className="text-gray-700 text-lg">{t.perPost}</p>
            )}

            {stand.ophaalzin && taal === 'nl' && !stand.speldje_opgehaald && <p className="text-gray-600 mt-6">{stand.ophaalzin}</p>}

            {!stand.betaald && !stand.betaling_bekend && naAanmelding && (
                <p className="text-gray-600 mt-6">
                    {t.nogBetalen}{' '}
                    <a href={betaalLink || VASTE_TIKKIE} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{t.dezeLink}</a>.
                </p>
            )}
        </div>
    );
}
