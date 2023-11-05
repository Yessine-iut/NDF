package fr.unice.tpimobile.api;

import com.google.gson.JsonObject
import okhttp3.MultipartBody
import retrofit2.http.*

interface OcrService {
    @POST("ocr/")
    suspend fun sendFacture(@Body post : MultipartBody): JsonObject
}
