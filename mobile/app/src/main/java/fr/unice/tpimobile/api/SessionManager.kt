package fr.unice.tpimobile.api

import org.json.JSONObject

class SessionManager {
    companion object {
        @JvmStatic
        var token:String = "token"
        var username:String = ""
        var mail:String = ""
        lateinit var services:ArrayList<String>;
    }
}