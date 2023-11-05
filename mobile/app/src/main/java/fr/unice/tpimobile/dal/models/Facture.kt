package fr.unice.tpimobile.dal.models


import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.google.gson.annotations.SerializedName
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
class Facture (
    @SerializedName("tva")
    val tva: String,
    @SerializedName("totalTtc")
    val ttc: String,
    @SerializedName("totalHt")
    val ht: String,
    @SerializedName("categorie")
    val categorie: String,
    @SerializedName("dateAchat")
    val date: String,
    @SerializedName("crediteur")
    val siret: String,
    @SerializedName("idUtilisateur")
    val utilisateur: String,
    @SerializedName("service")
    val service: String,
){
    fun toJSONObject(): JsonObject {
        val gson = Gson()
        val jsonParser = JsonParser()
        return jsonParser.parse(gson.toJson(this)) as JsonObject
    }
}

