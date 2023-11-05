package fr.unice.tpimobile.dal.repositories

import com.google.gson.JsonObject
import fr.unice.tpimobile.api.OcrService
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit


class FactureRepository {
    var client = OkHttpClient.Builder()
        .connectTimeout(100, TimeUnit.SECONDS)
        .readTimeout(100, TimeUnit.SECONDS)
        .retryOnConnectionFailure(true)
        .build()

    val retrofit = Retrofit.Builder()
        .addConverterFactory(GsonConverterFactory.create())
        .baseUrl("http://10.0.2.2:8000/")
        .client(client)
        .build()
    val apiService = retrofit.create(OcrService::class.java)

    suspend fun sendFacture(objet: MultipartBody): JsonObject {
        return apiService.sendFacture(objet)
    }
}