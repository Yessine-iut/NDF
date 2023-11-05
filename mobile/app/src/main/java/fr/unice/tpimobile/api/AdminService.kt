package fr.unice.tpimobile.api;

import com.google.gson.JsonObject
import retrofit2.http.*

interface AdminService {
    @POST("login/")
    suspend fun login(@Body objet: JsonObject): JsonObject

    @POST("/api/factures")
    suspend fun createFacture(@Query("secret_token") secret_token: String,
                              @Body objet: JsonObject): JsonObject
}
