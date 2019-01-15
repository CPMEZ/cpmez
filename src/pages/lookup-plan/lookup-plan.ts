import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpPage } from '../help/help';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { PreviewPage } from '../preview/preview';


@IonicPage()
@Component({
  selector: 'page-lookup-plan',
  templateUrl: 'lookup-plan.html',
})
export class LookupPlanPage {

  types: string;
  type: string;
  searchTerm: string;
  searchTitle: string;
  target: any;
  itemsList: any;
  fromPage: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public PPP: PersonalPlansProvider) {
    this.types = this.navParams.get('types');
    this.type = this.navParams.get('type');
    this.searchTerm = this.navParams.get('searchTerm');
    this.fromPage = this.navParams.get('fromPage');
    this.target = this.navParams.get('target');  // plan we're merging into
    this.searchTitle = "Searching for " + this.navParams.get('searchName') + " to be added to " + this.target["name"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LookupPlanPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter LookupPlanPage');
    this.getPersonalList();
  }

  getPersonalList() {
    // console.log('getPersonalList', this.PPP.listPlans());
    this.itemsList = this.PPP.listPlans();
  }

  choose(which) {
    this.getPersonal(which);
  }


  getPersonal(which: string) {
    // get the selected content, 
    // go to preview/select page
    // console.log('getPersonal', which);
    // nav to the preview page
    this.navCtrl.push(PreviewPage, {
      source: which,
      target: this.target,
      fromPage: this.fromPage,
      type: this.type
    });
  }


  help() {
    this.navCtrl.push(HelpPage);
  }
}
