package fr.unice.tpimobile.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.forEach
import androidx.lifecycle.lifecycleScope
import com.google.android.material.bottomnavigation.BottomNavigationView
import fr.unice.tpimobile.MainActivity
import fr.unice.tpimobile.R
import fr.unice.tpimobile.api.SessionManager
import fr.unice.tpimobile.dal.models.Login
import fr.unice.tpimobile.dal.repositories.AdminRepository
import fr.unice.tpimobile.databinding.LoginBinding
import kotlinx.coroutines.launch
import retrofit2.HttpException


class LoginActivity  :AppCompatActivity() {

    private lateinit var binding: LoginBinding


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = LoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val bottomNavigationView = binding.bottomNavigation
        bottomNavigationView.menu.forEach { item ->
            when(item.itemId){
                R.id.login->{
                    if(SessionManager.token!="token")
                        item.isVisible = false
                }
                R.id.logout->{
                    if(SessionManager.token=="token")
                        item.isVisible = false
                }
                R.id.scanner-> {
                    if(SessionManager.token=="token")
                        item.isVisible = false
                }
            }
        }
        bottomNavigationView.setOnNavigationItemSelectedListener(BottomNavigationView.OnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.logout-> {
                    SessionManager.token = "token"
                    SessionManager.username = ""
                    startActivity(Intent(applicationContext, MainActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
                R.id.login-> {
                    return@OnNavigationItemSelectedListener true
                }
                R.id.scanner-> {
                    startActivity(Intent(applicationContext, ScanFactureActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true                }
                R.id.home -> {
                    startActivity(Intent(applicationContext, MainActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
            }
            false
        })

        val login: Button =binding.login

        binding.mdpoublie.setOnClickListener {
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("http://10.0.2.2:3000/forgotpassword"))
            startActivity(browserIntent)
        }

        login.setOnClickListener {
            lifecycleScope.launch {

                val mail = binding.username
                val password = binding.password
                val loginCredentials = Login(mail.text.toString(),password.text.toString())
                try{
                    val res = AdminRepository().login(loginCredentials.toJSONObject())
                    SessionManager.token = res.getAsJsonPrimitive("token").asString
                    SessionManager.username = res.getAsJsonObject("user").getAsJsonPrimitive("prenom").asString
                    SessionManager.mail = res.getAsJsonObject("user").getAsJsonPrimitive("mail").asString
                    SessionManager.services = ArrayList()

                    val jArray = res.getAsJsonObject("user").getAsJsonArray("services")

                    if (jArray != null) {
                        for (i in 0 until jArray.size()){
                            val obj = jArray.get(i).asJsonObject.getAsJsonPrimitive("nom").asString
                            SessionManager.services.add(obj)
                        }
                    }

                    Toast.makeText(applicationContext, "connexion reussie!", Toast.LENGTH_LONG).show()
                    bottomNavigationView.selectedItemId = R.id.home
                }
                catch(e: HttpException){
                    Toast.makeText(applicationContext, "mail/mdp incorrecte!", Toast.LENGTH_LONG).show()
                }

            }
        }
    }
}