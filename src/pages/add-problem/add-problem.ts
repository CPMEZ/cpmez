import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';

@IonicPage()
@Component({
  selector: 'page-add-problem',
  templateUrl: 'add-problem.html',
})
export class AddProblemPage {
  plan: any;
  problem: {} = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider) {
    // plan to which problem added
    this.plan = navParams.get('plan');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProblemPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AddProblemPage');
    this.problem["text"] = "";
    this.problem["hint"] = "";
    // note these are initialized even if problem is taken from master list
    if (!this.problem["goals"]) {
      this.problem["goals"] = [] as any[];
    }
    if (!this.problem["interventions"]) {
      this.problem["interventions"] = [] as any[];
    }
    this.problem["expanded"] = true;
    this.problem["icon"] = "arrow-dropdown";
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.plan.problems.push(this.problem);
    this.PPP.write();    
    if (this.plt.is('mobile')) {
      this.toast.show('Topic Added', '1500', 'center').subscribe(t => { });
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
