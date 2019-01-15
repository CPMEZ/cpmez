import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpPage } from '../help/help';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

@IonicPage()
@Component({
  selector: 'page-edit-plan',
  templateUrl: 'edit-plan.html',
})
export class EditPlanPage {
  plan: any;
  savePlan: { name: string, text: string, updated: string } = { name: "", text: "", updated: "" };
  newName: string;
  canUseName: boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public PPP: PersonalPlansProvider) {
    this.plan = navParams.get('plan');
    this.savePlan.name = this.plan.name;
    this.newName = this.plan.name;
    this.savePlan.text = this.plan.text;
    this.savePlan.updated = this.plan.updated;
    this.canUseName = true;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPlanPage');
  }

  nameChange() {
    // console.log('checking');
    if (this.savePlan.name === this.newName.trim())  {
      // cause it's ok to reuse the same name you already had
      this.canUseName = true;
    } else {
      // console.log('checking=', this.newName);
      this.canUseName = this.PPP.checkPlanName(this.newName.trim());
      // console.log('canUseName', this.canUseName);
    }
    // console.log('checking=', this.canUseName);
  }

  editDone() {
    this.plan['name'] = this.newName;
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.PPP.write();
    this.navCtrl.pop();
  }
  cancelEdit() {
    // undo on cancel
    this.plan.name = this.savePlan.name;
    this.plan.text = this.savePlan.text;
    this.plan.updated = this.savePlan.updated;
    this.navCtrl.pop();
  }

  help() {
    this.navCtrl.push(HelpPage);
  }

}
