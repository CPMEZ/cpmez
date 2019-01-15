import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';
import { LookupPlanPage } from '../lookup-plan/lookup-plan';

@IonicPage()
@Component({
  selector: 'page-add-plan',
  templateUrl: 'add-plan.html',
})
export class AddPlanPage {
  condition: {};
  newPlan: { name: string, text: string, created: string, updated: string } = { name: "", text: "", created: "", updated: "" };
  canUseName: boolean;
  planToMerge: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlanPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AddPlanPage');
  }

  nameChange(){
    // console.log('checking');
    this.canUseName = this.PPP.checkPlanName(this.newPlan['name'].trim());
    // console.log('checking=', this.canUseName);
  }

  addPlan(type: string) {
    // console.log(this.newPlan.name, this.newPlan.text);
    if (this.PPP.checkPlanName(this.newPlan['name'])) {}
    this.PPP.addPlan(this.newPlan, type);
    if (this.plt.is('mobile')) {
      this.toast.show('Added ' + this.newPlan['name'], '1500', 'center').subscribe(t => { });
    }
    this.navCtrl.pop();
  }

  copyPlan() {
    this.navCtrl.push(LookupPlanPage, {
      types: "",
      type: "My Plan",
      searchName: "Your Plan",
      target: this.newPlan,
      fromPage: 'plans'
    });
  }
  
  cancelEdit() {
    this.navCtrl.pop();
  }

  help() {
    this.navCtrl.push(HelpPage);
  }

}
