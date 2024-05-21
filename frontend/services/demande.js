const createDemande = async ({ nom, email, sujet, message }) => {
    try {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        };

        let bodyContent = JSON.stringify({
            "status": "published",
            "nom": nom,
            "email": email,
            "sujet": sujet,
            "message": message
        });

        let response = await fetch(`${process.env.API_URL}demandes`, {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        if (!response.ok) {
            throw new Error(`Failed to submit demand: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error submitting demand: ${error.message}`);
    }
};

module.exports = createDemande;
