import React, { useState, createContext, useContext } from 'react';
// Correctie: De Appwrite SDK wordt nu als een lokaal pakket geïmporteerd.
// Zorg ervoor dat je 'npm install appwrite' hebt uitgevoerd in je projectmap.
import { Client, Databases, ID } from 'appwrite';

// --- Appwrite Configuratie ---
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '6874f0b40015fc341b14';
const APPWRITE_DATABASE_ID = '68873afd0015cc5075e5';
const APPWRITE_COLLECTION_STAMGAST_ID = '68a174c900178a2511e7';

// Initialiseer de Appwrite Client en Database
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
const databases = new Databases(client);

// --- Vertaaldata ---
const translations = {
    nl: {
        // Landing Page
        becomeRegular: 'Word stamgast!',
        supportPitch: 'Als Stamgast steun je het Café Theater Festival zodat er elk jaar weer een bijzonder programma samengesteld kan worden in cafés en andere horecazaken. Daarnaast draag je bij aan het ontwikkeltraject van de theatermakers. Als dank voor je steun en enthousiasme houden we je als eerste op de hoogte van alle ontwikkelingen.',
        tier1_title: '€25 per jaar',
        tier1_desc: 'Vanaf €25 per jaar ben je als eerste op de hoogte van al het Café Theater Festival nieuws via de mail én de Secret Stamgasten WhatsApp tijdens het festival.',
        tier2_title: '€50 of €100 per jaar',
        tier2_desc: 'Vanaf €50 per jaar ben je als eerste op de hoogte van het Café Theater Festival nieuws via de mail én de Secret Stamgasten WhatsApp tijdens het festival. Daarnaast nodigen we je uit voor de opening van het festival én krijg je persoonlijk kijkadvies van ons artistieke team!',
        forCompanies_title: 'Bedrijf of organisatie?',
        forCompanies_desc: 'Wil je als bedrijf het festival een warm hart toedragen? Dat kan! Neem contact op met ons via',
        forCompanies_email: 'info@cafetheaterfestival.nl',
        forCompanies_interest: 'als je hierin interesse hebt.',
        taxBenefit_title: 'Belastingvoordeel',
        taxBenefit_desc: 'Stichting Cafetheaterfestival heeft een culturele ANBI-status. Dit betekent dat je gift hierdoor voor 125% aftrekbaar kan zijn voor de belasting.',
        taxBenefit_link: 'Meer info vind je hier',
        // Form
        formTitle: 'Stamgastenformulier',
        goBack: 'Terug',
        name: 'Naam',
        email: 'E-mailadres',
        phone: 'Telefoonnummer',
        street: 'Straat',
        houseNumber: 'Huisnummer',
        postalCode: 'Postcode',
        city: 'Stad',
        iban: 'IBAN',
        ibanName: 'IBAN op naam van',
        contribution: 'Jaarlijkse bijdrage (€)',
        authorization: 'Hierbij machtig ik het CTF jaarlijks mijn stamgastenbijdrage van mijn rekening af te schrijven.',
        submitButton: 'Stamgast Worden & Betalen',
        submitting: 'Bezig met versturen...',
        // Messages
        authError: 'Je moet akkoord gaan met de machtiging om door te gaan.',
        successMsg: 'Bedankt! Je wordt nu doorgestuurd om de betaling te voltooien. Je ontvangt een bevestiging na betaling.',
        errorMsg: 'Er is iets misgegaan. Probeer het later opnieuw of neem contact op.',
    },
    en: {
        // Landing Page
        becomeRegular: 'Become a Regular!',
        supportPitch: 'As a Regular, you support the Café Theater Festival, enabling a special program to be curated in cafes and other venues each year. You also contribute to the development of our theater makers. As a thank you for your support and enthusiasm, we will keep you informed of all developments first.',
        tier1_title: '€25 per year',
        tier1_desc: 'For €25 per year, you will be the first to know about all Café Theater Festival news via email and the Secret Regulars WhatsApp during the festival.',
        tier2_title: '€50 or €100 per year',
        tier2_desc: 'For €50 per year, you will be the first to know about all Café Theater Festival news via email and the Secret Regulars WhatsApp during the festival. We will also invite you to the festival opening and you will receive personal viewing advice from our artistic team!',
        forCompanies_title: 'Company or organization?',
        forCompanies_desc: 'Would you like to support the festival as a company? That\'s possible! Contact us at',
        forCompanies_email: 'info@cafetheaterfestival.nl',
        forCompanies_interest: 'if you are interested.',
        taxBenefit_title: 'Tax Benefit',
        taxBenefit_desc: 'The Cafetheaterfestival Foundation has a cultural ANBI status. This means your donation can be 125% tax-deductible.',
        taxBenefit_link: 'More info can be found here',
        // Form
        formTitle: 'Regulars Form',
        goBack: 'Back',
        name: 'Name',
        email: 'Email address',
        phone: 'Phone number',
        street: 'Street',
        houseNumber: 'House number',
        postalCode: 'Postal code',
        city: 'City',
        iban: 'IBAN',
        ibanName: 'IBAN in the name of',
        contribution: 'Annual contribution (€)',
        authorization: 'I hereby authorize CTF to annually debit my regulars contribution from my account.',
        submitButton: 'Become a Regular & Pay',
        submitting: 'Submitting...',
        // Messages
        authError: 'You must agree to the authorization to proceed.',
        successMsg: 'Thank you! You are now being redirected to complete the payment. You will receive a confirmation after payment.',
        errorMsg: 'Something went wrong. Please try again later or contact us.',
    }
};

// --- Taal Context ---
const LanguageContext = createContext();
const useLang = () => useContext(LanguageContext);

// --- Landingspagina Component ---
const LandingPage = ({ onShowForm }) => {
    const { t } = useLang();
    return (
        <div className="bg-[#20747f] min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 md:p-12 my-8">
                <h1 className="text-4xl md:text-5xl font-bold text-ctf-green mb-4">{t.becomeRegular}</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">{t.supportPitch}</p>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">{t.tier1_title}</h2>
                        <p className="text-gray-600">{t.tier1_desc}</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">{t.tier2_title}</h2>
                        <p className="text-gray-600">{t.tier2_desc}</p>
                    </div>
                </div>

                <button
                    onClick={onShowForm}
                    className="w-full mt-10 bg-ctf-green text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-ctf-dark-green transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                    {t.becomeRegular}
                </button>

                <div className="mt-12 grid md:grid-cols-2 gap-8">
                     <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">{t.forCompanies_title}</h2>
                        <p className="text-gray-600">
                            {t.forCompanies_desc} <a href={`mailto:${t.forCompanies_email}`} className="text-ctf-green font-semibold hover:underline">{t.forCompanies_email}</a> {t.forCompanies_interest}
                        </p>
                    </div>
                     <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">{t.taxBenefit_title}</h2>
                        <p className="text-gray-600">
                            {t.taxBenefit_desc} <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/aftrek-en-kortingen/content/gift-aftrekken" target="_blank" rel="noopener noreferrer" className="text-ctf-green font-semibold hover:underline">{t.taxBenefit_link}</a>.
                        </p>
                    </div>
                </div>

                <img
                    src="https://cafetheaterfestival.nl/wp-content/uploads/2024/12/52042429455_e11fe1902e_o-copy-scaled.jpg"
                    alt="Festival sfeerbeeld"
                    className="w-full mt-12 rounded-lg shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x800/20747F/FFFFFF?text=Festival+Sfeer'; }}
                />
            </div>
        </div>
    );
};


// --- Stamgastenformulier Component ---
const StamgastForm = ({ onBack }) => {
    const { t } = useLang();
    const [formData, setFormData] = useState({
        Name: '', Email: '', Phone: '', Straat: '', Huisnummer: '', Postcode: '', Stad: '', IBAN: '', NaamIBAN: '', Bedrag: 25, Machtiging: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (!formData.Machtiging) {
            setMessage({ type: 'error', text: t.authError });
            return;
        }
        setIsSubmitting(true);

        const mandaadID = Math.floor(1000 + Math.random() * 9000).toString();
        const sinds = new Date().toLocaleDateString('nl-NL').replace(/\//g, '-');

        try {
            const documentData = {
                ...formData,
                Bedrag: parseInt(formData.Bedrag, 10),
                MandaadID: mandaadID,
                Sinds: sinds,
            };
            await databases.createDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_STAMGAST_ID,
                ID.unique(),
                documentData
            );
            
            // Toon succesbericht
            setMessage({ type: 'success', text: t.successMsg });

            // Open Tikkie in een nieuw tabblad
            window.open('https://tikkie.me/pay/CTF/rPFwoJnu1xBT3t5JUeK8qg/25,50,100', '_blank');
            
            // Reset het formulier
            setFormData({ Name: '', Email: '', Phone: '', Straat: '', Huisnummer: '', Postcode: '', Stad: '', IBAN: '', NaamIBAN: '', Bedrag: 25, Machtiging: false });

        } catch (error) {
            console.error("Fout bij het versturen naar Appwrite:", error);
            setMessage({ type: 'error', text: t.errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const FormInput = ({ label, id, ...props }) => (
        <div className="mb-5">
            <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input id={id} {...props} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-ctf-green" />
        </div>
    );

    return (
        <div className="relative min-h-screen bg-ctf-green flex items-center justify-center p-4">
             <img
                src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/Logo_Web_Trans_Zwart.png"
                alt="Logo"
                className="absolute top-5 right-5 w-36 h-auto hidden md:block"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x50/FFFFFF/000000?text=Logo'; }}
            />
            <div className="relative w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl my-8">
                <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">&larr; {t.goBack}</button>
                <h1 className="text-3xl font-bold text-center text-ctf-green mb-6">{t.formTitle}</h1>
                <form onSubmit={handleSubmit}>
                    <FormInput label={t.name} id="Name" name="Name" type="text" value={formData.Name} onChange={handleChange} required />
                    <FormInput label={t.email} id="Email" name="Email" type="email" value={formData.Email} onChange={handleChange} required />
                    <FormInput label={t.phone} id="Phone" name="Phone" type="tel" value={formData.Phone} onChange={handleChange} required />
                    
                    <div className="md:flex md:gap-4">
                        <div className="flex-grow"><FormInput label={t.street} id="Straat" name="Straat" type="text" value={formData.Straat} onChange={handleChange} required /></div>
                        <div className="w-full md:w-1/3"><FormInput label={t.houseNumber} id="Huisnummer" name="Huisnummer" type="text" value={formData.Huisnummer} onChange={handleChange} required /></div>
                    </div>
                     <div className="md:flex md:gap-4">
                        <div className="w-full md:w-1/3"><FormInput label={t.postalCode} id="Postcode" name="Postcode" type="text" value={formData.Postcode} onChange={handleChange} required /></div>
                        <div className="flex-grow"><FormInput label={t.city} id="Stad" name="Stad" type="text" value={formData.Stad} onChange={handleChange} required /></div>
                    </div>

                    <FormInput label={t.iban} id="IBAN" name="IBAN" type="text" value={formData.IBAN} onChange={handleChange} required />
                    <FormInput label={t.ibanName} id="NaamIBAN" name="NaamIBAN" type="text" value={formData.NaamIBAN} onChange={handleChange} required />
                    <FormInput label={t.contribution} id="Bedrag" name="Bedrag" type="number" min="25" value={formData.Bedrag} onChange={handleChange} required />

                    <div className="flex items-center my-6">
                        <input type="checkbox" id="Machtiging" name="Machtiging" checked={formData.Machtiging} onChange={handleChange} required className="h-5 w-5 text-ctf-green rounded border-gray-300 focus:ring-ctf-green" />
                        <label htmlFor="Machtiging" className="ml-3 text-sm text-gray-700">{t.authorization}</label>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-ctf-dark-green text-white font-bold py-3 px-4 rounded-lg hover:bg-ctf-green focus:outline-none focus:ring-4 focus:ring-green-400 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isSubmitting ? t.submitting : t.submitButton}
                    </button>
                </form>
                {message && (
                    <div className={`mt-6 p-4 text-center rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Taalwisselaar Component ---
const LanguageSwitcher = () => {
    const { lang, setLang } = useLang();
    
    const toggleLang = () => {
        setLang(lang === 'nl' ? 'en' : 'nl');
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <button 
                onClick={toggleLang}
                className="bg-white/80 backdrop-blur-sm text-ctf-dark-green font-semibold py-2 px-4 rounded-full shadow-md hover:bg-white transition-all duration-300"
            >
                {lang === 'nl' ? 'EN' : 'NL'}
            </button>
        </div>
    );
};


// --- Hoofd App Component ---
function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'form'
  const [lang, setLang] = useState('nl'); // 'nl' or 'en'
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
        <LanguageSwitcher />
        {view === 'landing' ? (
            <LandingPage onShowForm={() => setView('form')} />
        ) : (
            <StamgastForm onBack={() => setView('landing')} />
        )}
    </LanguageContext.Provider>
  );
}

export default App;
