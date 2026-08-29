import '@angular/compiler';
import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';


// Parche directo sobre RadSideDrawer para habilitar la escritura de _isRootView
if (RadSideDrawer && RadSideDrawer.prototype) {
  Object.defineProperty(RadSideDrawer.prototype, '_isRootView', {
    get() {
      return this.__isRootView || false;
    },
    set(value) {
      this.__isRootView = value;
    },
    configurable: true,
    enumerable: true,
  });
}


import { AppModule } from './app/app.module';


runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
