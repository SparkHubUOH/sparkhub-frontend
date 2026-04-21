import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../services/translation/translation';
import { Header } from '../../layout/header/header';

@Component({
  selector: 'app-contact',
  imports: [TranslateModule, CommonModule, Header],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  currentLang = 'en';
  languageSelected: string;

  contactChannels = [
    {
      icon: 'bi-telephone-fill',
      titleKey: 'CONTACT.PHONE_TITLE',
      valueKey: 'CONTACT.PHONE_NUMBER',
      action: 'tel:+966123456789',
      actionText: 'CONTACT.CALL_US',
    },
    {
      icon: 'bi-envelope-fill',
      titleKey: 'CONTACT.EMAIL_TITLE',
      valueKey: 'CONTACT.EMAIL_ADDRESS',
      action: 'mailto:support@sparkhub.edu',
      actionText: 'CONTACT.EMAIL_US',
    },
  ];

  constructor(private translate: TranslateService) {
    const initialLang = localStorage.getItem('lang') || 'en';
    this.languageSelected = initialLang;
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }
}
