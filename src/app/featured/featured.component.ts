import { Component, OnInit } from '@angular/core'
import { Application, ImageSource, Utils } from '@nativescript/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'

let camera: any
let SocialShare: any

try {
  camera = require('@nativescript/camera')
} catch (e) {
  try {
    camera = require('nativescript-camera')
  } catch (err) {}
}

try {
  SocialShare = require('nativescript-social-share')
} catch (e) {
  try {
    SocialShare = require('@nativescript/social-share')
  } catch (err) {}
}

@Component({
  selector: 'Featured',
  templateUrl: './featured.component.html',
  standalone: false
})
export class FeaturedComponent implements OnInit {
  public capturedImage: any = null
  private imageSourceForShare: ImageSource | null = null

  ngOnInit(): void {
    this.asegurarContextoAndroid()
  }

  // Polifill para compatibilidad de contexto Android en Preview
  private asegurarContextoAndroid(): void {
    if (Utils.android && Application.android) {
      const appContext = Utils.android.getApplicationContext()
      if (!(Application.android as any).context) {
        (Application.android as any).context = appContext
      }
      if (!(Application.android as any).foregroundActivity) {
        (Application.android as any).foregroundActivity = Application.android.startActivity || appContext
      }
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  public onTakePicture(): void {
    if (!camera) {
      this.cargarFotoSimulada()
      return
    }

    const requestPermissions = camera.requestPermissions || camera.requestCameraPermissions
    const takePicture = camera.takePicture

    if (requestPermissions) {
      requestPermissions().then(
        () => {
          takePicture({ width: 600, height: 600, keepAspectRatio: true }).then(
            (imageAsset: any) => {
              this.capturedImage = imageAsset
              ImageSource.fromAsset(imageAsset).then((imgSrc) => {
                this.imageSourceForShare = imgSrc
              })
            },
            () => this.cargarFotoSimulada()
          )
        },
        () => {
          console.log('Preview bloqueó la cámara nativa. Cargando foto de prueba.')
          this.cargarFotoSimulada()
        }
      )
    } else {
      this.cargarFotoSimulada()
    }
  }

  private cargarFotoSimulada(): void {
    const url = 'https://picsum.photos/600/600'
    this.capturedImage = url
    ImageSource.fromUrl(url)
      .then((imgSrc) => {
        this.imageSourceForShare = imgSrc
      })
      .catch((err) => console.log('Error al crear ImageSource:', err))
  }

  public onShareText(): void {
    this.asegurarContextoAndroid()
    const texto = '¡Hola! Te recomiendo explorar esta aplicación de viajes y hoteles.'
    
    try {
      if (SocialShare) {
        const shareText = SocialShare.shareText || SocialShare.share
        shareText(texto)
      } else {
        this.compartirTextoNativo(texto)
      }
    } catch (e) {
      console.log('SocialShare falló. Activando Intent nativo de Android.')
      this.compartirTextoNativo(texto)
    }
  }

  public onShareImage(): void {
    this.asegurarContextoAndroid()

    try {
      if (SocialShare && this.imageSourceForShare) {
        SocialShare.shareImage(this.imageSourceForShare)
      } else if (this.imageSourceForShare) {
        this.compartirImagenNativa(this.imageSourceForShare)
      } else {
        console.log('No hay imagen cargada para compartir.')
      }
    } catch (e) {
      console.log('SocialShare falló. Activando Intent nativo para imagen.')
      if (this.imageSourceForShare) {
        this.compartirImagenNativa(this.imageSourceForShare)
      }
    }
  }

  // Intent nativo de Android para compartir texto
  private compartirTextoNativo(texto: string): void {
    if (Utils.android) {
      try {
        const intent = new android.content.Intent(android.content.Intent.ACTION_SEND)
        intent.setType('text/plain')
        intent.putExtra(android.content.Intent.EXTRA_TEXT, texto)

        const activity = Application.android.foregroundActivity || Application.android.startActivity
        if (activity) {
          activity.startActivity(android.content.Intent.createChooser(intent, 'Compartir texto vía'))
        } else {
          const context = Utils.android.getApplicationContext()
          const chooser = android.content.Intent.createChooser(intent, 'Compartir texto vía')
          chooser.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
          context.startActivity(chooser)
        }
      } catch (err) {
        console.log('Error en Intent nativo de compartir texto:', err)
      }
    }
  }

  // Intent nativo de Android para compartir imagen
  private compartirImagenNativa(imageSource: ImageSource): void {
    if (Utils.android) {
      try {
        const builder = new android.os.StrictMode.VmPolicy.Builder()
        android.os.StrictMode.setVmPolicy(builder.build())

        const context = Utils.android.getApplicationContext()
        const bmp = imageSource.android
        const cachePath = new java.io.File(context.getCacheDir(), 'images')
        cachePath.mkdirs()
        const filePath = new java.io.File(cachePath, 'shared_image.png')
        const stream = new java.io.FileOutputStream(filePath)
        bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream)
        stream.close()

        const imageUri = android.net.Uri.fromFile(filePath)
        const intent = new android.content.Intent(android.content.Intent.ACTION_SEND)
        intent.setType('image/png')
        intent.putExtra(android.content.Intent.EXTRA_STREAM, imageUri)

        const activity = Application.android.foregroundActivity || Application.android.startActivity
        if (activity) {
          activity.startActivity(android.content.Intent.createChooser(intent, 'Compartir foto vía'))
        } else {
          const chooser = android.content.Intent.createChooser(intent, 'Compartir foto vía')
          chooser.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
          context.startActivity(chooser)
        }
      } catch (err) {
        console.log('Error en Intent nativo de compartir imagen:', err)
      }
    }
  }
}