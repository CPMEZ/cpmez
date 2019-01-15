import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';

@IonicPage()
@Component({
  selector: 'page-add-goal',
  templateUrl: 'add-goal.html',
})
export class AddGoalPage {
  plan: any;
  problem: any;
  goal: {} = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider) {
    // problem to which goal added
    this.plan = navParams.get('plan');
    this.problem = navParams.get('problem');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddGoalPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AddGoalPage');
    this.goal["text"] = "";
    this.goal["hint"] = "";
    this.goal["term"] = (!!this.goal["term"]) ? this.goal["term"] : "ST";
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.problem.goals.push(this.goal);
    this.PPP.write();
    if (this.plt.is('mobile')) {
      this.toast.show('Outcome Added', '1500', 'center').subscribe(t => { });
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
