package fr.unice.tpimobile.dal.repositories

import com.google.gson.JsonObject
import fr.unice.tpimobile.api.AdminService
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class AdminRepository {
    var client = OkHttpClient.Builder()
        .connectTimeout(100, TimeUnit.SECONDS)
        .readTimeout(100, TimeUnit.SECONDS).build()
    val retrofit = Retrofit.Builder()
        .addConverterFactory(GsonConverterFactory.create())
        .baseUrl("http://10.0.2.2:8080/")
        .client(client)
        .build()
    val apiService = retrofit.create(AdminService::class.java)

    suspend fun login(objet: JsonObject): JsonObject {
        return apiService.login(objet)
    }
    suspend fun createFacture(token:String, objet: JsonObject): JsonObject {
        return apiService.createFacture(token,objet)
    }
}