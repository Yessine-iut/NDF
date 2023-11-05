package fr.unice.tpimobile.dal.models

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.google.gson.annotations.SerializedName
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
class Login (
    @SerializedName("mail")
    val mail: String,
    @SerializedName("password")
    val password: String,
){
    fun toJSONObject(): JsonObject {
        val gson = Gson()
        val jsonParser = JsonParser()
        return jsonParser.parse(gson.toJson(this)) as JsonObject
    }
}

