package fr.unice.tpimobile

import fr.unice.tpimobile.ui.ScanFactureActivity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.forEach
import com.google.android.material.bottomnavigation.BottomNavigationView
import fr.unice.tpimobile.api.SessionManager
import fr.unice.tpimobile.databinding.ActivityMainBinding
import fr.unice.tpimobile.ui.LoginActivity


class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val bottomNavigationView = binding.bottomNavigation
        bottomNavigationView.menu.forEach { item ->
            when(item.itemId){
                R.id.login->{
                    item.isChecked = false
                    if(SessionManager.token!="token"){
                        binding.descHome.text=
                            "Vous êtes connecté en tant que ${SessionManager.username}."
                        item.isVisible = false

                    }
                }
                R.id.scanner-> {
                    if(SessionManager.token=="token")
                        item.isVisible = false
                }
                R.id.home->{
                    item.isChecked = true
                }
                R.id.logout->{
                    item.isChecked = false
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
                    Toast.makeText(applicationContext, "deconnexion reussie!", Toast.LENGTH_LONG).show()
                    startActivity(Intent(applicationContext, MainActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
                R.id.login-> {
                    startActivity(Intent(applicationContext, LoginActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
                R.id.scanner-> {
                    startActivity(Intent(applicationContext, ScanFactureActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
                R.id.home -> return@OnNavigationItemSelectedListener true
            }
            false
        })

    }
}