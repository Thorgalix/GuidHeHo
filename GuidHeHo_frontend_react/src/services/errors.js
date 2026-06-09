// Transforme une réponse d'erreur API en message lisible pour l'interface.
export function getErrorMessage(result, response = null) {
    if (response?.status === 401) {
        return "Session expirée ou token invalide. Reconnecte-toi puis réessaie."
    }

    if (!result) {
        return response
            ? `Erreur serveur (${response.status})`
            : "Une erreur est survenue"
    }

    if (typeof result === "string") {
        return result
    }

    if (result.detail) {
        return result.detail
    }

    if (result.error) {
        return result.error
    }

    if (result.non_field_errors) {
        return Array.isArray(result.non_field_errors)
            ? result.non_field_errors.join(" ")
            : result.non_field_errors
    }

    const messages = []

    for (const [key, value] of Object.entries(result)) {
        if (Array.isArray(value)) {
            messages.push(`${key}: ${value.join(" ")}`)
        } else if (value) {
            messages.push(`${key}: ${value}`)
        }
    }

    return messages.length > 0
        ? messages.join(" | ")
        : response
            ? `Erreur serveur (${response.status})`
            : "Une erreur est survenue"
}
