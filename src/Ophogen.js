import React, { useState, useEffect } from 'react';

// Je bijdrage ophogen naar het bedrag waarvoor je een stamgastpin krijgt,
// via de persoonlijke link in de vooraankondigingsmail: /ophogen/<token>.
//
// Hier gaat geld af van iemands rekening, dus het scherm moet twee dingen
// tegelijk zijn: makkelijk én vertrouwenwekkend. Makkelijk betekent één
// duidelijke keuze en één knop. Vertrouwenwekkend betekent dat je vóór het
// bevestigen precies ziet wat er verandert, van welke rekening het gaat, en
// wanneer — en dat er nergens iets vooraf staat aangevinkt.
//
// Verlagen kan hier niet. Minder gaan betalen is een gesprek en geen knop.

const API_URL = 'https://backend.cafetheaterfestival.nl';

/** "50,00" → 50 */
const naarGetal = (tekst) => Number(String(tekst || '0').replace(/\./g, '').replace(',', '.'));

/** 75 → "75,00" */
const naarTekst = (getal) => getal.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const datumNet = (iso) => {
    if (!iso) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12)
        .toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function Ophogen({ token }) {
    const [gegevens, setGegevens] = useState(null);
    const [fout, setFout] = useState(null);
    const [keuze, setKeuze] = useState(null);        // bedrag in euro's, of 'anders'
    const [eigenBedrag, setEigenBedrag] = useState('');
    const [bezig, setBezig] = useState(false);
    const [klaar, setKlaar] = useState(null);        // { bedrag, vanaf }

    useEffect(() => {
        fetch(`${API_URL}/api/public/stamgast/ophogen/${encodeURIComponent(token)}`, {
            headers: { Accept: 'application/json' },
        })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Deze link klopt niet of is niet meer geldig.'))))
            .then(setGegevens)
            .catch((e) => setFout(e.message));
    }, [token]);

    if (fout && !gegevens) return <Kader><Melding>{fout}</Melding></Kader>;
    if (!gegevens) return <Kader><p className="text-gray-500">Even je gegevens ophalen…</p></Kader>;

    const drempel = naarGetal(gegevens.drempel);
    const huidig = naarGetal(gegevens.huidig_bedrag);

    // De keuzes: de pingrens zelf, en twee ruimere stappen. Nooit een bedrag
    // tonen dat lager is dan wat iemand nu al betaalt.
    const opties = [drempel, drempel * 1.5, drempel * 2].filter((b) => b > huidig);

    const gekozenBedrag = keuze === 'anders' ? Number(String(eigenBedrag).replace(',', '.')) : keuze;
    const geldig = Number.isFinite(gekozenBedrag) && gekozenBedrag >= drempel && gekozenBedrag > huidig;

    const bevestigen = async () => {
        setBezig(true);
        setFout(null);
        try {
            const res = await fetch(`${API_URL}/api/public/stamgast/ophogen/${encodeURIComponent(token)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ bedrag: gekozenBedrag }),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(j.message || 'Het ophogen lukte niet. Probeer het later nog eens.');
            setKlaar(j);
        } catch (e) {
            setFout(e.message);
        } finally {
            setBezig(false);
        }
    };

    // ------------------------------------------------------------- gelukt

    if (klaar) {
        return (
            <Kader kop="Gelukt — dank je wel">
                <p className="text-lg text-gray-800">
                    Je bijdrage staat nu op <b>€ {klaar.bedrag} per jaar</b>.
                </p>
                <Regels rijen={[
                    ['Gaat in', klaar.vanaf ? `bij de incasso van ${datumNet(klaar.vanaf)} of later` : 'bij je volgende bijdrage'],
                    ['Van rekening', gegevens.iban],
                    ['Kenmerk machtiging', gegevens.mandaat_id],
                ]} />
                <p className="text-gray-700">
                    Je krijgt een <b>stamgastpin</b>. Die ligt voor je klaar bij het festivalkantoor —
                    kom hem ophalen als je er bent.
                </p>
                <p className="text-sm text-gray-500">
                    Je krijgt hier ook een bevestiging van per mail. Klopt er iets niet? Mail ons via{' '}
                    <a className="text-[#9f4493] underline" href="mailto:stamgasten@cafetheaterfestival.nl">
                        stamgasten@cafetheaterfestival.nl
                    </a>{' '}
                    en we draaien het zo terug.
                </p>
            </Kader>
        );
    }

    // ------------------------------------------------- niets te verhogen

    if (gegevens.opgezegd) {
        return (
            <Kader kop="Je bijdrage is gestopt">
                <p className="text-gray-700">
                    Volgens onze administratie is je Stamgastbijdrage stopgezet. Wil je toch weer
                    meedoen? Mail ons even via{' '}
                    <a className="text-[#9f4493] underline" href="mailto:stamgasten@cafetheaterfestival.nl">
                        stamgasten@cafetheaterfestival.nl
                    </a>.
                </p>
            </Kader>
        );
    }

    if (gegevens.in_de_wacht) {
        return (
            <Kader kop="Dat is al geregeld">
                <p className="text-lg text-gray-800">
                    Je hebt je bijdrage al opgehoogd naar <b>€ {gegevens.in_de_wacht.bedrag} per jaar</b>.
                </p>
                <Regels rijen={[
                    ['Gaat in', `bij de incasso van ${datumNet(gegevens.in_de_wacht.vanaf)} of later`],
                    ['Van rekening', gegevens.iban],
                ]} />
                <p className="text-sm text-gray-500">
                    Wil je het toch anders? Mail ons via{' '}
                    <a className="text-[#9f4493] underline" href="mailto:stamgasten@cafetheaterfestival.nl">
                        stamgasten@cafetheaterfestival.nl
                    </a>.
                </p>
            </Kader>
        );
    }

    if (gegevens.haalt_de_pin_al) {
        return (
            <Kader kop="Je hebt al recht op de pin">
                <p className="text-lg text-gray-800">
                    Je bijdrage is <b>€ {gegevens.huidig_bedrag} per jaar</b> — dat is al vanaf
                    € {gegevens.drempel}, dus de stamgastpin is voor jou.
                </p>
                <p className="text-gray-700">
                    Nog niet opgehaald? Vraag ernaar bij het festivalkantoor.
                </p>
                <p className="text-sm text-gray-500">
                    Wil je alsnog meer bijdragen? Dat kan altijd — mail ons via{' '}
                    <a className="text-[#9f4493] underline" href="mailto:stamgasten@cafetheaterfestival.nl">
                        stamgasten@cafetheaterfestival.nl
                    </a>.
                </p>
            </Kader>
        );
    }

    // ------------------------------------------------------------ kiezen

    return (
        <Kader kop="Je bijdrage ophogen">
            <p className="text-gray-700">
                Hallo {gegevens.naam.split(' ')[0]}, je draagt nu <b>€ {gegevens.huidig_bedrag} per jaar</b> bij.
                Vanaf <b>€ {gegevens.drempel}</b> krijg je een stamgastpin — en kunnen we meer makers
                een plek geven.
            </p>

            <fieldset className="border-0 p-0 m-0">
                <legend className="text-sm font-semibold text-gray-700 mb-2">Kies je nieuwe bijdrage per jaar</legend>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {opties.map((bedrag) => (
                        <button
                            key={bedrag}
                            type="button"
                            onClick={() => setKeuze(bedrag)}
                            aria-pressed={keuze === bedrag}
                            className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                                keuze === bedrag
                                    ? 'border-[#9f4493] bg-[#faf6fb]'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <span className="block text-lg font-bold text-gray-900">€ {naarTekst(bedrag)}</span>
                            <span className="block text-xs text-gray-500">per jaar</span>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setKeuze('anders')}
                    aria-pressed={keuze === 'anders'}
                    className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-left transition ${
                        keuze === 'anders' ? 'border-[#9f4493] bg-[#faf6fb]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <span className="block font-semibold text-gray-900">Een ander bedrag</span>
                </button>

                {keuze === 'anders' && (
                    <label className="mt-2 flex items-center gap-2">
                        <span className="text-gray-500">€</span>
                        <input
                            type="number"
                            min={drempel}
                            step="1"
                            inputMode="decimal"
                            value={eigenBedrag}
                            onChange={(e) => setEigenBedrag(e.target.value)}
                            placeholder={String(drempel)}
                            aria-label="Bedrag per jaar in euro's"
                            className="w-32 rounded-lg border border-gray-300 px-3 py-2"
                        />
                        <span className="text-sm text-gray-500">per jaar, minimaal € {gegevens.drempel}</span>
                    </label>
                )}
            </fieldset>

            {/* Vóór het bevestigen precies laten zien wat er verandert. Wie geld
                van zijn rekening laat afschrijven, hoort niets te hoeven raden. */}
            {geldig && (
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Dit ga je bevestigen</div>
                    <Regels rijen={[
                        ['Van', `€ ${gegevens.huidig_bedrag} per jaar`],
                        ['Naar', `€ ${naarTekst(gekozenBedrag)} per jaar`],
                        ['Gaat in', gegevens.ingaand ? `bij de incasso van ${datumNet(gegevens.ingaand)} of later` : 'bij je volgende bijdrage'],
                        ['Van rekening', gegevens.iban],
                        ['Kenmerk machtiging', gegevens.mandaat_id],
                    ]} />
                </div>
            )}

            {fout && <Melding>{fout}</Melding>}

            <button
                type="button"
                onClick={bevestigen}
                disabled={!geldig || bezig}
                className="w-full rounded-xl bg-[#9f4493] px-5 py-3.5 text-white text-base font-bold
                    disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#8a3a80] transition"
            >
                {bezig ? 'Bezig…' : geldig ? `Ophogen naar € ${naarTekst(gekozenBedrag)} per jaar` : 'Kies eerst een bedrag'}
            </button>

            <p className="text-xs text-gray-500 leading-relaxed">
                Je machtiging blijft dezelfde; alleen het bedrag verandert. Je kunt het altijd weer
                aanpassen of stoppen door te mailen naar{' '}
                <a className="text-[#9f4493] underline" href="mailto:stamgasten@cafetheaterfestival.nl">
                    stamgasten@cafetheaterfestival.nl
                </a>. Na een afschrijving heb je nog acht weken om je bank te vragen het terug te boeken.
            </p>
        </Kader>
    );
}

// ---------------------------------------------------------------- bouwstenen

function Kader({ kop, children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8">
            <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg overflow-hidden">
                <div className="bg-[#9f4493] text-white px-7 py-6">
                    <div className="text-xs uppercase tracking-wide opacity-80">Café Theater Festival</div>
                    <div className="text-xl font-bold mt-1">{kop || 'Je Stamgastbijdrage'}</div>
                </div>
                <div className="px-7 py-6 space-y-4">{children}</div>
            </div>
        </div>
    );
}

function Regels({ rijen }) {
    return (
        <dl className="divide-y divide-gray-100 border-y border-gray-100">
            {rijen.filter(([, waarde]) => waarde).map(([label, waarde]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-sm text-gray-500">{label}</dt>
                    <dd className="text-sm font-semibold text-gray-900 text-right">{waarde}</dd>
                </div>
            ))}
        </dl>
    );
}

function Melding({ children }) {
    return (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {children}
        </div>
    );
}
