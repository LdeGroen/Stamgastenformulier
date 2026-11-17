import React, { useState, useEffect } from 'react';

// Afmeldpagina voor stamgasten, bereikbaar via de persoonlijke link in de
// vooraankondigingsmail: /afmelden/<token>.
//
// Bewust kort en zonder drempels. Iemand die wil stoppen en daarvoor eerst moet
// mailen, wordt boos of stornerert de incasso — dat kost meer dan de opzegging
// zelf. De reden is optioneel: niemand tegenhouden omdat hij niet wil uitleggen
// waarom.

const API_URL = 'https://backend.cafetheaterfestival.nl';

const REDENEN = [
    'Het past niet meer in mijn budget',
    'Ik kom niet meer bij het festival',
    'Ik steun liever op een andere manier',
    'Anders',
];

export default function Afmelden({ token }) {
    const [gegevens, setGegevens] = useState(null);
    const [fout, setFout] = useState(null);
    const [reden, setReden] = useState('');
    const [toelichting, setToelichting] = useState('');
    const [bezig, setBezig] = useState(false);
    const [klaar, setKlaar] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/public/stamgast/afmelden/${encodeURIComponent(token)}`, {
            headers: { Accept: 'application/json' },
        })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Deze link klopt niet of is niet meer geldig.'))))
            .then((d) => { setGegevens(d); if (d.al_opgezegd) setKlaar(true); })
            .catch((e) => setFout(e.message));
    }, [token]);

    const versturen = async () => {
        setBezig(true);
        setFout(null);
        try {
            const samen = [reden, toelichting].filter(Boolean).join(' — ');
            const res = await fetch(`${API_URL}/api/public/stamgast/afmelden/${encodeURIComponent(token)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ reden: samen || null }),
            });
            if (!res.ok) throw new Error('Het opzeggen lukte niet. Probeer het later nog eens.');
            setKlaar(true);
        } catch (e) {
            setFout(e.message);
        } finally {
            setBezig(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8">
            <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg overflow-hidden">
                <div className="bg-[#20747f] text-white px-7 py-6">
                    <div className="text-xs uppercase tracking-wide opacity-80">Café Theater Festival</div>
                    <h1 className="text-2xl font-bold mt-1">Stamgastbijdrage stopzetten</h1>
                </div>

                <div className="p-7">
                    {fout && !gegevens && (
                        <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{fout}</p>
                    )}

                    {!gegevens && !fout && <p className="text-gray-500">Even ophalen…</p>}

                    {gegevens && klaar && (
                        <div>
                            <div className="text-4xl mb-3">🙏</div>
                            <h2 className="text-xl font-bold text-gray-800">Je bijdrage is stopgezet</h2>
                            <p className="text-gray-600 mt-2">
                                We schrijven niets meer af. Bedankt voor de tijd dat je Stamgast was — dankzij
                                jou hebben makers hun voorstellingen kunnen ontwikkelen.
                            </p>
                            <p className="text-gray-500 text-sm mt-4">
                                Van gedachten veranderd? Je bent altijd welkom terug via{' '}
                                <a href="https://stamgast.cafetheaterfestival.nl" className="text-[#20747f] underline">
                                    stamgast.cafetheaterfestival.nl
                                </a>.
                            </p>
                        </div>
                    )}

                    {gegevens && !klaar && (
                        <>
                            <p className="text-gray-600">
                                Hoi {gegevens.naam}, je staat nu ingeschreven voor <b>€ {gegevens.bedrag}</b> per jaar
                                van rekening {gegevens.iban}.
                            </p>

                            <div className="mt-6">
                                <p className="text-sm text-gray-500 mb-2">Mogen we vragen waarom je stopt? (niet verplicht)</p>
                                <div className="space-y-2">
                                    {REDENEN.map((r) => (
                                        <label key={r} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="reden"
                                                checked={reden === r}
                                                onChange={() => setReden(r)}
                                            />
                                            <span className="text-gray-700">{r}</span>
                                        </label>
                                    ))}
                                </div>
                                <textarea
                                    value={toelichting}
                                    onChange={(e) => setToelichting(e.target.value)}
                                    placeholder="Wil je er iets bij zeggen? (optioneel)"
                                    rows={3}
                                    maxLength={800}
                                    className="mt-3 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#20747f] focus:border-transparent"
                                />
                            </div>

                            {fout && <p className="text-red-700 mt-3">{fout}</p>}

                            <button
                                onClick={versturen}
                                disabled={bezig}
                                className="mt-5 w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold rounded-lg py-3"
                            >
                                {bezig ? 'Bezig…' : 'Mijn bijdrage stopzetten'}
                            </button>

                            <p className="text-xs text-gray-400 mt-4">
                                Liever iets anders? Als je alleen het bedrag wilt aanpassen, mail ons via{' '}
                                <a href="mailto:stamgasten@cafetheaterfestival.nl" className="text-[#20747f] underline">
                                    stamgasten@cafetheaterfestival.nl
                                </a> — dan hoef je niet helemaal te stoppen.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
