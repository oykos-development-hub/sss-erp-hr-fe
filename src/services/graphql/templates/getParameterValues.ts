const getParameterValues = `query dataForTemplate_Overview($id: Int!) {
    dataForTemplate_Overview(id: $id) {
        message
        status
        data
        item {
            tekuci_datum
            tekuca_godina
            tekuci_mjesec
            ime_prezime
            jmbg
            ulica
            organizaciona_jedinica
            odjeljenje
            radno_mjesto
            radno_mjesto_uslovi
            broj_sistematizacije
            datum_sistematizacije
            datum_pocetka_ugovora
            datum_pocetka_rada
            datum_isteka_ugovora
            trajanje_ugovora_u_danima
            steceni_broj_dana_odmora
            preostali_broj_dana_odmora
            potroseni_broj_dana_odmora
            radni_sati_sedmicno
            datum_pocetka_godisnjeg_odmora
            datum_kraja_godisnjeg_odmora
            ocjena
            obrazovanje 
            godine_staza
            mjeseci_staza
            dani_staza
        }
    }
}`;

export default getParameterValues;
