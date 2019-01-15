import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';

@IonicPage()
@Component({
  selector: 'page-add-intervention',
  templateUrl: 'add-intervention.html',
})
export class AddInterventionPage {
  plan: any;
  problem: any;
  intervention: {} = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider) {
    // problem to which intervention added
    this.plan = navParams.get("plan");
    this.problem = navParams.get("problem");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInterventionPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AddInterventionPage');
    this.intervention["text"] = "";
    this.intervention["hint"] = "";
  
    if (!this.problem.interventions) this.problem["interventions"] = [] as any;
    this.intervention["interdisciplinary"] = false;
    this.intervention["nursing"] = false;
    this.intervention["aide"] = false;
    this.intervention["bereavement"] = false;
    this.intervention["dietary"] = false;
    this.intervention["music"] = false;
    this.intervention["OT"] = false;
    this.intervention["PT"] = false;
    this.intervention["pharmacist"] = false;
    this.intervention["social"] = false;
    this.intervention["spiritual"] = false;
    this.intervention["speech"] = false;
    this.intervention["volunteer"] = false;
    this.intervention["other"] = "";
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.problem.interventions.push(this.intervention);
    this.PPP.write();    
    if (this.plt.is('mobile')) {
      this.toast.show('Intervention Added', '1500', 'center').subscribe(t => { });
    }
    this.navCtrl.pop();
  }
  cancelEdit() {
    // exit w/o save
    this.navCtrl.pop();
  }

  help() {
    this.navCtrl.push(HelpPage);
  }

}