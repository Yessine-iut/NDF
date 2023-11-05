package fr.unice.tpimobile.ui

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.graphics.Matrix
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.forEach
import androidx.lifecycle.lifecycleScope
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.gson.JsonObject
import fr.unice.tpimobile.MainActivity
import fr.unice.tpimobile.R
import fr.unice.tpimobile.api.SessionManager
import fr.unice.tpimobile.dal.repositories.FactureRepository
import fr.unice.tpimobile.databinding.ScanfactureBinding
import kotlinx.coroutines.launch
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.ByteArrayOutputStream


class ScanFactureActivity  : AppCompatActivity() {

    private lateinit var binding: ScanfactureBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ScanfactureBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val adapter: ArrayAdapter<String> = ArrayAdapter<String>(this, R.layout.spinner_item, SessionManager.services)

        binding.serviceInput.adapter = adapter

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
                R.id.scanner-> item.isChecked=true
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
                    startActivity(Intent(applicationContext, LoginActivity::class.java))
                    overridePendingTransition(0, 0)
                    return@OnNavigationItemSelectedListener true
                }
                R.id.scanner-> {
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

        binding.btnScan.setOnClickListener {
            val intent = Intent("android.media.action.IMAGE_CAPTURE")
            startActivityForResult(intent, 1337)
        }

        binding.btnSelect.setOnClickListener {
            val photoPickerIntent = Intent(Intent.ACTION_PICK)
            photoPickerIntent.type = "image/*"
            startActivityForResult(photoPickerIntent, 1338)
        }
    }
    @RequiresApi(Build.VERSION_CODES.Q)
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        var imageBitmap: Bitmap? = null;
        try {
            if (requestCode === 1338) {
                val selectedImage = data?.data
                //var bitmap = MediaStore.Images.Media.getBitmap(this.contentResolver, selectedImage)
                //imageBitmap = rotateImage(bitmap, 0)
                val source = ImageDecoder.createSource(
                    this.contentResolver,
                    selectedImage!!
                )
                imageBitmap = ImageDecoder.decodeBitmap(source)
                }

            if (requestCode === 1337) {
                //Récupération de l'image
                imageBitmap = data?.extras?.get("data") as Bitmap
            }
            binding.progressBar1.visibility = View.VISIBLE
            binding.progressText.visibility = View.VISIBLE
            binding.btnScan.visibility = View.GONE
            binding.btnScan.visibility = View.GONE
            binding.btnSelect.visibility = View.GONE
            binding.service.visibility = View.GONE
            binding.serviceInput.visibility = View.GONE

            var actual = this

            //Requete pour le back (communication faites mais transfert d'image ne fonctionne pas)
            lifecycleScope.launch {
                val os = ByteArrayOutputStream()
                imageBitmap?.compress(Bitmap.CompressFormat.PNG, 100, os)

                val imgBytes = os.toByteArray()

                val formBody = MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart(
                        "img",
                        "imgocr",
                        RequestBody.create(MediaType.parse("image/png"), imgBytes)
                    )
                    .build()
                var res:JsonObject?=null;
                try{
                    res = FactureRepository().sendFacture(formBody)
                    val intent = Intent(actual, DetailsFactureActivity::class.java)
                    intent.putExtra("tva", res.getAsJsonObject("totalTVA").get("value").asString)
                    intent.putExtra("ttc", res.getAsJsonObject("totalTTC").get("value").asString)
                    intent.putExtra("ht", res.getAsJsonObject("totalHT").get("value").asString)
                    intent.putExtra("img", res.getAsJsonObject("base64").get("value").asString)
                    intent.putExtra("categorie", res.getAsJsonObject("categorie").get("value").asString)
                    intent.putExtra("date", res.getAsJsonObject("date").get("value").asString)
                    intent.putExtra("siret", res.getAsJsonObject("siret").get("value").asString)
                    intent.putExtra("service", binding.serviceInput.selectedItem.toString())
                    startActivity(intent)
                }
                catch(e:Exception){
                    println(res)
                }


            }
        }
        catch (e:Exception){
            Toast.makeText(applicationContext, "Erreur: "+e.message, Toast.LENGTH_LONG).show()

        }
    }
    fun rotateImage(source: Bitmap, angle: Int): Bitmap? {
        val matrix = Matrix()
        matrix.postRotate(angle.toFloat())
        return Bitmap.createBitmap(
            source, 0, 0, source.width, source.height,
            matrix, true
        )
    }
}