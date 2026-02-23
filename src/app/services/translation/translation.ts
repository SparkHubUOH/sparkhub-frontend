import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Translation {
  defaultLang = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setFallbackLang(this.defaultLang);
  }

  public initLanguage(): Promise<void> {
    const savedLang = localStorage.getItem('lang') || this.defaultLang;

    const loadObservable = this.translate.use(savedLang);

    return firstValueFrom(loadObservable).then(() => {
      localStorage.setItem('lang', savedLang);
      console.log(`Initial language loaded: ${savedLang}`);
    });
  }

  useLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  get currentLang() {
    return this.translate.getCurrentLang() || this.defaultLang;
  }

}

export { TranslateService };
