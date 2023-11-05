package fr.unice.tpimobile.ui

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.forEach
import androidx.lifecycle.lifecycleScope
import com.google.android.material.bottomnavigation.BottomNavigationView
import fr.unice.tpimobile.MainActivity
import fr.unice.tpimobile.R
import fr.unice.tpimobile.api.SessionManager
import fr.unice.tpimobile.dal.models.Facture
import fr.unice.tpimobile.dal.repositories.AdminRepository
import fr.unice.tpimobile.databinding.DetailsfactureBinding
import kotlinx.coroutines.launch
import retrofit2.HttpException


class DetailsFactureActivity : AppCompatActivity() {

    private lateinit var binding: DetailsfactureBinding


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DetailsfactureBinding.inflate(layoutInflater)
        setContentView(binding.root)
        retrieveData()

        val bottomNavigationView = binding.bottomNavigation
        bottomNavigationView.menu.forEach { item ->
            when (item.itemId) {
                R.id.login -> {
                    if (SessionManager.token != "token")
                        item.isVisible = false
                }
                R.id.logout -> {
                    if (SessionManager.token == "token")
                        item.isVisible = false
                }
                R.id.scanner -> {
                    item.isChecked = true
                }
            }
        }
        bottomNavigationView.setOnNavigationItemSelectedListener(BottomNavigationView.OnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.logout -> {
                    SessionManager.token = "token"
                    SessionManager.username = ""
                    Toast.makeText(applicationContext, "deconnexion reussie!", Toast.LENGTH_LONG)
                        .show()
                    startActivity(Intent(applicationContext, MainActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
                R.id.login -> {
                    startActivity(Intent(applicationContext, LoginActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
                R.id.scanner -> {
                    return@OnNavigationItemSelectedListener true
                }
                R.id.home -> {
                    startActivity(Intent(applicationContext, MainActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
            }
            false
        })

        binding.afficherFacture.setOnClickListener {
            println(binding.afficherFacture.text)
            if (binding.afficherFacture.text == "afficher facture") {
                binding.afficherFacture.text = "retour"
                binding.totalTVA.visibility = View.GONE
                binding.totalTVAInput.visibility = View.GONE
                binding.totalTTCInput.visibility = View.GONE
                binding.totalTTC.visibility = View.GONE
                binding.totalHT.visibility = View.GONE
                binding.totalHTInput.visibility = View.GONE
                binding.categorie.visibility = View.GONE
                binding.categorieInput.visibility = View.GONE
                binding.date.visibility = View.GONE
                binding.dateInput.visibility = View.GONE
                binding.siret.visibility = View.GONE
                binding.siretInput.visibility = View.GONE
                binding.imageFacture.visibility = View.VISIBLE
                binding.legende.visibility = View.VISIBLE
                binding.items.visibility = View.VISIBLE
            } else {
                binding.afficherFacture.text = "afficher facture"
                binding.imageFacture.visibility = View.GONE
                binding.legende.visibility = View.GONE
                binding.items.visibility = View.GONE
                binding.totalTVA.visibility = View.VISIBLE
                binding.totalTVAInput.visibility = View.VISIBLE
                binding.totalTTCInput.visibility = View.VISIBLE
                binding.totalTTC.visibility = View.VISIBLE
                binding.totalHT.visibility = View.VISIBLE
                binding.totalHTInput.visibility = View.VISIBLE
                binding.categorie.visibility = View.VISIBLE
                binding.categorieInput.visibility = View.VISIBLE
                binding.date.visibility = View.VISIBLE
                binding.dateInput.visibility = View.VISIBLE
                binding.siret.visibility = View.VISIBLE
                binding.siretInput.visibility = View.VISIBLE
            }
        }
        binding.addFacture.setOnClickListener {
            lifecycleScope.launch {

                val facture = Facture(
                    binding.totalTVAInput.text.toString(),
                    binding.totalTTCInput.text.toString(),
                    binding.totalHTInput.text.toString(),
                    binding.categorieInput.selectedItem.toString(),
                    binding.dateInput.text.toString(),
                    binding.siretInput.text.toString(),
                    SessionManager.mail,
                    intent.getStringExtra("service").toString()
                )
                try {
                    AdminRepository().createFacture(SessionManager.token,facture.toJSONObject())
                    Toast.makeText(applicationContext, "facture sauvegardée!", Toast.LENGTH_LONG)
                        .show()
                    bottomNavigationView.selectedItemId = R.id.home
                } catch (e: HttpException) {
                    Toast.makeText(applicationContext, "échec de sauvegarde!", Toast.LENGTH_LONG)
                        .show()
                }
            }
        }
    }

    fun retrieveData() {
        binding.totalTVAInput.setText(intent.getStringExtra("tva").toString())
        binding.totalTTCInput.setText(intent.getStringExtra("ttc").toString())
        binding.totalHTInput.setText(intent.getStringExtra("ht").toString())
        val items = arrayOf("restauration", "transports", "commerce", "herbergement")

        val adapter: ArrayAdapter<String> = ArrayAdapter<String>(this, R.layout.spinner_item, items)

        binding.categorieInput.adapter = adapter
        binding.categorieInput.setSelection(
            adapter.getPosition(
                intent.getStringExtra("categorie").toString()
            )
        );

        binding.dateInput.setText(intent.getStringExtra("date").toString())
        binding.siretInput.setText(intent.getStringExtra("siret").toString())


        val decodedString: ByteArray =
            Base64.decode(intent.getStringExtra("img").toString(), Base64.DEFAULT)
        val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
        binding.imageFacture.setImageBitmap(
            Bitmap.createScaledBitmap(
                decodedByte,
                decodedByte.width * 2,
                decodedByte.height * 2,
                true
            )
        )
        binding.imageFacture.layoutParams.height = 1000

    }
}