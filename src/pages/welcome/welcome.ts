import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { CarePlanPage } from '../careplan/careplan';
import { TermsPage } from '../terms/terms';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private loadCtrl: LoadingController,
    public PPP: PersonalPlansProvider) {
    console.log('Constructor Welcome');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }


  ionViewWillUnload() {
    console.log('ionViewWillUnload WelcomePage');
    this.events.unsubscribe('loadComplete');
  }

  goToWork() {
    // console.log('loading plans from welcome');
    let loading = this.loadCtrl.create({
      content: 'Getting your plans...'
    });
    loading.present();
    this.PPP.loadPlans();
    // cause we don't have async on loadPlans,
    this.events.subscribe('loadComplete', (time) => {
      // console.log('got event loadComplete');
      try { loading.dismiss(); 
        // console.log('on loading complete event, plans =', this.PPP.plans);
      }
      catch (err) { console.log('load timeout before complete'); }
      this.navCtrl.setRoot(CarePlanPage);
    })
    // insurance
    setTimeout(() => {
      // console.log('in timer');
      try { loading.dismiss(); 
      }
      catch (err) { console.log('load complete before timeout'); }
      // TODO:  handle this
      // this.navCtrl.setRoot(CarePlanPage);
    }, 5000);
  }

  showTerms() {
    this.navCtrl.push(TermsPage);
  }

}
