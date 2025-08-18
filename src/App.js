import React, { useState } from 'react';
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

// --- Landingspagina Component ---
const LandingPage = ({ onShowForm }) => {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 md:p-12 my-8">
                <h1 className="text-4xl md:text-5xl font-bold text-ctf-green mb-4">Word stamgast!</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Als Stamgast steun je het Café Theater Festival zodat er elk jaar weer een bijzonder programma samengesteld kan worden in cafés en andere horecazaken. Daarnaast draag je bij aan het ontwikkeltraject van de theatermakers. Als dank voor je steun en enthousiasme houden we je als eerste op de hoogte van alle ontwikkelingen.
                </p>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">€25 per jaar</h2>
                        <p className="text-gray-600">
                            Vanaf €25 per jaar ben je als eerste op de hoogte van al het Café Theater Festival nieuws via de mail én de Secret Stamgasten WhatsApp tijdens het festival.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">€50 of €100 per jaar</h2>
                        <p className="text-gray-600">
                            Vanaf €50 per jaar ben je als eerste op de hoogte van het Café Theater Festival nieuws via de mail én de Secret Stamgasten WhatsApp tijdens het festival. Daarnaast nodigen we je uit voor de opening van het festival én krijg je persoonlijk kijkadvies van ons artistieke team!
                        </p>
                    </div>
                </div>

                <button
                    onClick={onShowForm}
                    className="w-full mt-10 bg-ctf-green text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-ctf-dark-green transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                    Word stamgast!
                </button>

                <div className="mt-12 grid md:grid-cols-2 gap-8">
                     <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">Bedrijf of organisatie?</h2>
                        <p className="text-gray-600">
                            Wil je als bedrijf het festival een warm hart toedragen? Dat kan! Neem contact op met ons via <a href="mailto:info@cafetheaterfestival.nl" className="text-ctf-green font-semibold hover:underline">info@cafetheaterfestival.nl</a> als je hierin interesse hebt.
                        </p>
                    </div>
                     <div>
                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-ctf-green pb-2 mb-3">Belastingvoordeel</h2>
                        <p className="text-gray-600">
                            Stichting Cafetheaterfestival heeft een culturele ANBI-status. Dit betekent dat je gift hierdoor voor 125% aftrekbaar kan zijn voor de belasting. <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/aftrek-en-kortingen/content/gift-aftrekken" target="_blank" rel="noopener noreferrer" className="text-ctf-green font-semibold hover:underline">Meer info vind je hier</a>.
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
    // State voor alle formuliervelden
    const [formData, setFormData] = useState({
        Name: '', Email: '', Phone: '', Straat: '', Huisnummer: '', Postcode: '', Stad: '', IBAN: '', NaamIBAN: '', Bedrag: 25, Machtiging: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '...' }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (!formData.Machtiging) {
            setMessage({ type: 'error', text: 'Je moet akkoord gaan met de machtiging om door te gaan.' });
            return;
        }
        setIsSubmitting(true);

        // Genereer MandaadID en Sinds datum
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
            setMessage({ type: 'success', text: 'Bedankt! Je bent nu officieel stamgast. Je ontvangt binnenkort een bevestiging.' });
            setFormData({ Name: '', Email: '', Phone: '', Straat: '', Huisnummer: '', Postcode: '', Stad: '', IBAN: '', NaamIBAN: '', Bedrag: 25, Machtiging: false });
        } catch (error) {
            console.error("Fout bij het versturen naar Appwrite:", error);
            setMessage({ type: 'error', text: 'Er is iets misgegaan. Probeer het later opnieuw of neem contact op.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper component voor formuliervelden
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
                <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">&larr; Terug</button>
                <h1 className="text-3xl font-bold text-center text-ctf-green mb-6">Stamgastenformulier</h1>
                <form onSubmit={handleSubmit}>
                    <FormInput label="Naam" id="Name" name="Name" type="text" value={formData.Name} onChange={handleChange} required />
                    <FormInput label="E-mailadres" id="Email" name="Email" type="email" value={formData.Email} onChange={handleChange} required />
                    <FormInput label="Telefoonnummer" id="Phone" name="Phone" type="tel" value={formData.Phone} onChange={handleChange} required />
                    
                    <div className="md:flex md:gap-4">
                        <div className="flex-grow"><FormInput label="Straat" id="Straat" name="Straat" type="text" value={formData.Straat} onChange={handleChange} required /></div>
                        <div className="w-full md:w-1/3"><FormInput label="Huisnummer" id="Huisnummer" name="Huisnummer" type="text" value={formData.Huisnummer} onChange={handleChange} required /></div>
                    </div>
                     <div className="md:flex md:gap-4">
                        <div className="w-full md:w-1/3"><FormInput label="Postcode" id="Postcode" name="Postcode" type="text" value={formData.Postcode} onChange={handleChange} required /></div>
                        <div className="flex-grow"><FormInput label="Stad" id="Stad" name="Stad" type="text" value={formData.Stad} onChange={handleChange} required /></div>
                    </div>

                    <FormInput label="IBAN" id="IBAN" name="IBAN" type="text" value={formData.IBAN} onChange={handleChange} required />
                    <FormInput label="IBAN op naam van" id="NaamIBAN" name="NaamIBAN" type="text" value={formData.NaamIBAN} onChange={handleChange} required />
                    <FormInput label="Jaarlijkse bijdrage (€)" id="Bedrag" name="Bedrag" type="number" min="25" value={formData.Bedrag} onChange={handleChange} required />

                    <div className="flex items-center my-6">
                        <input type="checkbox" id="Machtiging" name="Machtiging" checked={formData.Machtiging} onChange={handleChange} required className="h-5 w-5 text-ctf-green rounded border-gray-300 focus:ring-ctf-green" />
                        <label htmlFor="Machtiging" className="ml-3 text-sm text-gray-700">Hierbij machtig ik het CTF jaarlijks mijn stamgastenbijdrage van mijn rekening af te schrijven.</label>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-ctf-dark-green text-white font-bold py-3 px-4 rounded-lg hover:bg-ctf-green focus:outline-none focus:ring-4 focus:ring-green-400 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Bezig met versturen...' : 'Stamgast Worden'}
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


// --- Hoofd App Component ---
function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'form'

  if (view === 'landing') {
    return <LandingPage onShowForm={() => setView('form')} />;
  }

  return <StamgastForm onBack={() => setView('landing')} />;
}

export default App;
