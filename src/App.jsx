import React, { useState } from 'react';
import Afmelden from './Afmelden';
import Ophogen from './Ophogen';
import Betaalstatus from './Betaalstatus';

// Aanmelden gaat sinds 18-11-2026 via een eigen route: die maakt een Tikkie
// voor precies deze aanmelding, zodat de backend ziet of er betaald is en dan
// de QR-code voor het speldje vrijgeeft. Zie App\Support\StamgastBetaling.
const API_URL = 'https://backend.cafetheaterfestival.nl';

// --- Styling Constanten (ongewijzigd) ---
const theme = {
  primaryColor: 'text-[#20747f]',
  accentColor: 'bg-orange-400 hover:bg-orange-500',
  inputFocus: 'focus:ring-2 focus:ring-[#20747f] focus:border-transparent',
};

// --- Vertalingen Object (Aangepast voor nieuwe flow) ---
const translations = {
  nl: {
    landingPage: {
      mainTitle: 'Word Stamgast!',
      subtitle: 'Steun het festival en bezoek alle voorstellingen met je passe-partout',
      intro: 'Word Stamgast van het Café Theater Festival en ontvang je festival passe-partout in de vorm van een exclusief speldje. Met het worden van Stamgast draag je direct bij aan het ontwikkeltraject van de deelnemende makers. Ook helpt het ons om ieder jaar weer een bijzonder programma samen te kunnen stellen. Stamgast worden kan vanaf €50,- per jaar (altijd opzegbaar). Let op: per Stamgast één exclusief speldje.',
      tier2Title: '€50 of meer per jaar',
      tier2Desc: 'Vanaf €50 per jaar krijg je jaarlijks het speciale stamgasten-speldje. Dit speldje geldt als passe-partout voor het hele programma van het CTF dat jaar. Er wordt daardoor niet meer na de voorstelling van je verwacht dat je een donatie doet, jij doneert namelijk al aan het hele festival!',
      ctaButton: 'Word stamgast!',
      orgTitle: 'Bedrijf of organisatie?',
      orgDesc: 'Wil je als bedrijf het festival een warm hart toedragen? Dat kan! Neem contact op met ons via',
      taxTitle: 'Belastingvoordeel',
      taxDesc: 'Stichting Cafetheaterfestival heeft een culturele ANBI-status. Dit betekent dat je gift hierdoor voor 125% aftrekbaar kan zijn voor de belasting.',
      moreInfo: 'Meer info vind je hier.',
    },
    form: {
      mainTitle: 'Vul je gegevens in',
      name: 'Naam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      street: 'Straat',
      houseNumber: 'Huisnummer',
      postalCode: 'Postcode',
      city: 'Stad',
      iban: 'IBAN',
      ibanName: 'IBAN op naam van',
      amount: 'Bedrag per jaar (€)',
      amountOption50: '€ 50',
      amountOptionCustom: 'Meer, namelijk...',
      amountMinError: 'Vul een bedrag hoger dan € 50 in.',
      amountMaxError: 'Het bedrag kan maximaal € 1.000 zijn.',
      ibanError: 'Dit IBAN klopt niet. Kijk het nog even na.',
      backButton: 'Terug',
      amountPlaceholder: 'bv. 60',
      authorization: 'Hierbij machtig ik het CTF jaarlijks dit bedrag af te schrijven van mijn rekening.',
      privacyTitle: 'Zo gaan we met je gegevens om (AVG)',
      privacyItems: [
        'We bewaren alleen wat nodig is, en alleen zolang je stamgast bent: je rekeningnummer en naam om de jaarlijkse bijdrage af te schrijven, je adres om het stamgastenspeldje op te sturen, je e-mailadres voor stamgasten-updates en je telefoonnummer om belangrijke wijzigingen door te geven.',
        'Meld je je af als stamgast? Dan verwijderen we je acht weken later volledig uit ons systeem. Die acht weken zijn nodig omdat een laatste afschrijving in die tijd nog teruggeboekt kan worden. Daarna bewaren we geen gegevens meer.',
        'Afmelden of je gegevens inzien kan altijd via info@cafetheaterfestival.nl.',
      ],
      submitButton: 'Word stamgast & betalen',
      submitting: 'Verwerken...',
      // Aangepaste teksten voor de nieuwe Success flow
      successTitle: 'Aanmelding geslaagd!',
      successDesc: 'Bedankt voor je aanmelding. Klik op de knop hieronder om je betaling via Tikkie te voldoen.',
      manualPayButton: 'Betaal via Tikkie',
      manualPayNote: '(Opent in een nieuw tabblad)',
      error: 'Er is iets misgegaan. Probeer het opnieuw of neem contact op.',
    }
  },
  en: {
    landingPage: {
      mainTitle: 'Become a Stamgast!',
      subtitle: 'Support the festival and attend all performances with a passe-partout',
      intro: "Become a Stamgast of the Café Theater Festival and receive your festival pass in the form of an exclusive pin. By becoming a Stamgast, you contribute directly to the development of our performing artists. Your support also helps us curate a unique program every year. You can become a Stamgast from €50 per year (cancel anytime). Please note: you receive one exclusive pin per Stamgast.",
      tier2Title: '€50 or more per year',
      tier2Desc: "Starting at €50 per year, you will receive the special Stamgast pin annually. This pin serves as a festival pass for the entire CTF program that year. This means you will not be expected to make a donation after the performances, because you are already supporting the festival as a whole!",
      ctaButton: 'Become a Stamgast!',
      orgTitle: 'Company or organization?',
      orgDesc: 'Would your company like to support the festival? That’s possible! Please contact us at',
      taxTitle: 'Tax Benefit',
      taxDesc: 'The Cafetheaterfestival Foundation has a cultural ANBI status in the Netherlands. This may mean that your donation is 125% tax-deductible.',
      moreInfo: 'More info can be found here.',
    },
    form: {
      mainTitle: 'Fill in your details',
      name: 'Name',
      email: 'Email address',
      phone: 'Phone number',
      street: 'Street',
      houseNumber: 'House number',
      postalCode: 'Postal code',
      city: 'City',
      iban: 'IBAN',
      ibanName: 'IBAN in name of',
      amount: 'Amount per year (€)',
      amountOption50: '€ 50',
      amountOptionCustom: 'More, namely...',
      amountMinError: 'Please enter an amount greater than € 50.',
      amountMaxError: 'The amount can be at most € 1,000.',
      ibanError: 'This IBAN is not valid. Please check it.',
      backButton: 'Back',
      amountPlaceholder: 'e.g. 60',
      authorization: 'I hereby authorize CTF to debit this amount from my account annually.',
      privacyTitle: 'How we handle your data (GDPR)',
      privacyItems: [
        'We only store what is necessary, and only for as long as you are a Stamgast: your bank account number and name to collect the annual contribution, your address to send the Stamgast pin, your email address for Stamgast updates and your phone number to inform you of important changes.',
        'If you cancel your Stamgast membership, we completely remove you from our system eight weeks later. We need those eight weeks because a final direct debit can still be reversed during that time. After that, we keep no data.',
        'You can cancel or request access to your data at any time via info@cafetheaterfestival.nl.',
      ],
      submitButton: 'Become a Regular & Pay',
      submitting: 'Processing...',
      successTitle: 'Registration successful!',
      successDesc: 'Thank you for signing up. Please click the button below to complete your payment via Tikkie.',
      manualPayButton: 'Pay via Tikkie',
      manualPayNote: '(Opens in a new tab)',
      error: 'Something went wrong. Please try again or contact us.',
    }
  }
};

// --- De Componenten ---

const LanguageSwitcher = ({ language, setLanguage }) => {
  const activeClass = 'bg-[#20747f] text-white';
  const inactiveClass = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  
  return (
    <div className="absolute top-4 right-4 flex items-center bg-white rounded-lg p-1 shadow-md z-10">
      <button 
        onClick={() => setLanguage('nl')}
        className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${language === 'nl' ? activeClass : inactiveClass}`}
      >
        NL
      </button>
      <button 
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${language === 'en' ? activeClass : inactiveClass}`}
      >
        EN
      </button>
    </div>
  );
};

const LandingPage = ({ content, onShowForm }) => (
  <div>
    <h1 className={`text-4xl md:text-5xl font-bold text-center mb-5 ${theme.primaryColor}`}>{content.mainTitle}</h1>
    <p className="text-xl md:text-2xl text-center text-orange-400 mb-8 -mt-2 font-semibold">{content.subtitle}</p>
    <p className="text-lg text-gray-700 mb-4">{content.intro}</p>
    <h2 className={`text-2xl md:text-3xl font-bold border-b-2 border-gray-200 pb-3 mt-10 mb-5 ${theme.primaryColor}`}>{content.tier2Title}</h2>
    <p className="text-lg text-gray-700">{content.tier2Desc}</p>
    <button onClick={onShowForm} className={`w-full py-4 px-5 mt-8 text-lg font-bold text-white rounded-lg transition-all transform hover:-translate-y-0.5 ${theme.accentColor}`}>
      {content.ctaButton}
    </button>
    <h2 className={`text-2xl md:text-3xl font-bold border-b-2 border-gray-200 pb-3 mt-10 mb-5 ${theme.primaryColor}`}>{content.orgTitle}</h2>
    <p className="text-lg text-gray-700">{content.orgDesc} <a href="mailto:info@cafetheaterfestival.nl" className={`font-semibold hover:text-orange-500 ${theme.primaryColor}`}>info@cafetheaterfestival.nl</a></p>
    <h3 className={`text-xl font-bold mt-8 mb-2 ${theme.primaryColor}`}>{content.taxTitle}</h3>
    <p className="text-lg text-gray-700">{content.taxDesc} <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/aftrek-en-kortingen/content/gift-aftrekken" target="_blank" rel="noopener noreferrer" className={`font-semibold hover:text-orange-500 ${theme.primaryColor}`}>{content.moreInfo}</a></p>
    <img src="https://pub-36abfb48eca14eb8b366a0211191ef0e.r2.dev/legacy/52042429455_e11fe1902e_o-copy-scaled-kopie.jpg" alt="Sfeerbeeld Café Theater Festival" className="w-full h-auto rounded-lg mt-8 shadow-md" />
  </div>
);

// --- STAMGAST FORMULIER ---
const StamgastForm = ({ content, taal, onBack }) => {
  const [formData, setFormData] = useState({
    Name: '', Email: '', Phone: '', Straat: '', Huisnummer: '',
    Postcode: '', Stad: '', IBAN: '', NaamIBAN: '',
    Machtiging: false,
  });
  const [status, setStatus] = useState('idle');
  const [aanmelding, setAanmelding] = useState(null);

  const [amountOption, setAmountOption] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [ibanError, setIbanError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAmountError('');
    setIbanError('');

    let finalAmount;
    if (amountOption === '50') {
      finalAmount = 50;
    } else {
      finalAmount = parseInt(customAmount, 10);
      if (isNaN(finalAmount) || finalAmount <= 50) {
        setAmountError(content.amountMinError);
        return;
      }
      if (finalAmount > 1000) {
        setAmountError(content.amountMaxError);
        return;
      }
    }

    setStatus('submitting');
    try {
      // Mandaat-ID en ingangsdatum zet de server (audit FRM-11).
      const dataPayload = { ...formData, Bedrag: finalAmount };

      const res = await fetch(`${API_URL}/api/public/stamgast/aanmelden`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(dataPayload),
      });
      if (res.status === 422) {
        const fouten = (await res.json().catch(() => ({}))).errors || {};
        if (fouten.Bedrag) { setAmountError(content.amountMaxError); setStatus('idle'); return; }
        if (fouten.IBAN) { setIbanError(content.ibanError); setStatus('idle'); return; }
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();

      // Geen automatische redirect naar Tikkie: dat blokkeert de iframe. De
      // knop opent een nieuw tabblad, en hier wachten we op de betaling.
      setAanmelding({ token: d.token, tikkieUrl: d.tikkie_url });
      setStatus('success');
    } catch (error) {
      console.error('Aanmelden mislukt:', error);
      setStatus('error');
    }
  };

  if (status === 'success' && aanmelding) {
    return <Betaalstatus token={aanmelding.token} tikkieUrl={aanmelding.tikkieUrl} taal={taal} naAanmelding />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h2 className={`text-3xl font-bold text-center mb-8 ${theme.primaryColor}`}>{content.mainTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="md:col-span-2">
            <label htmlFor="Name" className="block mb-2 font-semibold text-gray-600">{content.name}</label>
            <input type="text" id="Name" name="Name" value={formData.Name} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} />
        </div>
        <div><label htmlFor="Email" className="block mb-2 font-semibold text-gray-600">{content.email}</label><input type="email" id="Email" name="Email" value={formData.Email} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} /></div>
        <div><label htmlFor="Phone" className="block mb-2 font-semibold text-gray-600">{content.phone}</label><input type="tel" id="Phone" name="Phone" value={formData.Phone} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} /></div>
        <div><label htmlFor="Straat" className="block mb-2 font-semibold text-gray-600">{content.street}</label><input type="text" id="Straat" name="Straat" value={formData.Straat} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} /></div>
        <div><label htmlFor="Huisnummer" className="block mb-2 font-semibold text-gray-600">{content.houseNumber}</label><input type="text" id="Huisnummer" name="Huisnummer" onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} /></div>
        <div><label htmlFor="Postcode" className="block mb-2 font-semibold text-gray-600">{content.postalCode}</label><input type="text" id="Postcode" name="Postcode" value={formData.Postcode} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} /></div>
        <div><label htmlFor="Stad" className="block mb-2 font-semibold text-gray-600">{content.city}</label><input type="text" id="Stad" name="Stad" value={formData.Stad} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} /></div>
        <div><label htmlFor="IBAN" className="block mb-2 font-semibold text-gray-600">{content.iban}</label><input type="text" id="IBAN" name="IBAN" value={formData.IBAN} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} />{ibanError && <p className="text-red-500 text-sm mt-1">{ibanError}</p>}</div>
        <div><label htmlFor="NaamIBAN" className="block mb-2 font-semibold text-gray-600">{content.ibanName}</label><input type="text" id="NaamIBAN" name="NaamIBAN" value={formData.NaamIBAN} onChange={handleChange} required className={`w-full p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`} /></div>
        
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-600">{content.amount}</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="amount50" 
                name="amountOption" 
                value="50"
                checked={amountOption === '50'}
                onChange={(e) => setAmountOption(e.target.value)}
                className="h-5 w-5 text-[#20747f] focus:ring-[#20747f] focus:ring-2 border-gray-300"
              />
              <label htmlFor="amount50" className="ml-2 text-gray-700">{content.amountOption50}</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="amountCustom" 
                name="amountOption" 
                value="custom"
                checked={amountOption === 'custom'}
                onChange={(e) => setAmountOption(e.target.value)}
                className="h-5 w-5 text-[#20747f] focus:ring-[#20747f] focus:ring-2 border-gray-300"
              />
              <label htmlFor="amountCustom" className="ml-2 text-gray-700">{content.amountOptionCustom}</label>
            </div>
          </div>

          {amountOption === 'custom' && (
            <div className="mt-3 sm:ml-[2.25rem]">
              <input 
                type="number" 
                id="customAmount" 
                name="customAmount" 
                value={customAmount} 
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder={content.amountPlaceholder} 
                min="51" 
                required 
                className={`w-full sm:w-1/2 p-3 border border-gray-300 rounded-md transition ${theme.inputFocus}`}
              />
              {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>}
            </div>
          )}
        </div>

        {/* AVG-databeleid: transparant wat we bewaren, waarvoor en hoe lang. */}
        <div className="md:col-span-2 mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">{content.privacyTitle}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {(content.privacyItems || []).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>

        <div className="md:col-span-2 flex items-center mt-4">
            <input type="checkbox" id="Machtiging" name="Machtiging" checked={formData.Machtiging} onChange={handleChange} required className={`h-5 w-5 mr-3 rounded border-gray-300 focus:ring-transparent text-[#20747f]`} />
            <label htmlFor="Machtiging" className="text-gray-600">{content.authorization}</label>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4 mt-8">
        <button 
          type="button" 
          onClick={onBack} 
          className="w-full sm:w-auto py-3 px-6 text-lg font-bold text-gray-700 bg-gray-200 rounded-lg transition-all hover:bg-gray-300 text-center"
        >
          {content.backButton}
        </button>
        <button 
          type="submit" 
          disabled={status === 'submitting'} 
          className={`w-full sm:w-auto py-3 px-6 text-lg font-bold text-white rounded-lg transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none ${theme.accentColor}`}
        >
          {status === 'submitting' ? content.submitting : content.submitButton}
        </button>
      </div>
      
      {status === 'error' && <div className="p-4 mt-6 rounded-md text-center font-semibold text-white bg-red-500">{content.error}</div>}
    </form>
  );
};

// --- APP COMPONENT ---
function App() {
  const [showForm, setShowForm] = useState(false);
  const [language, setLanguage] = useState('nl');

  const content = translations[language];

  // Afmelden loopt via een persoonlijke link uit de vooraankondigingsmail:
  // /afmelden/<token>. Geen router in deze app, dus we kijken zelf naar het pad.
  const afmeldToken = (window.location.pathname.match(/^\/afmelden\/([A-Za-z0-9]+)/) || [])[1];
  if (afmeldToken) {
    return <Afmelden token={afmeldToken} />;
  }

  // Ophogen naar het bedrag waarvoor je een stamgastpin krijgt: /ophogen/<token>.
  // Zelfde soort link als het afmelden.
  const ophoogToken = (window.location.pathname.match(/^\/ophogen\/([A-Za-z0-9]+)/) || [])[1];
  if (ophoogToken) {
    return <Ophogen token={ophoogToken} />;
  }

  // De QR-code voor het speldje, en de stand van je betaling: /qr/<token>.
  // Hier gaan de link uit de welkomstmail en de QR-code zelf naartoe.
  const qrToken = (window.location.pathname.match(/^\/qr\/([A-Za-z0-9]+)/) || [])[1];
  if (qrToken) {
    return (
      <div className="min-h-screen bg-[#20747f] font-sans flex items-start justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 relative">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <Betaalstatus token={qrToken} taal={language} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#20747f] font-sans flex items-start justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-12 relative">
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
        {!showForm ? (
          <LandingPage content={content.landingPage} onShowForm={() => setShowForm(true)} />
        ) : (
          <StamgastForm content={content.form} taal={language} onBack={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
}

export default App;