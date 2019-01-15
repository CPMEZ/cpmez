import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { ContentsPage } from '../contents/contents';
import { AddPlanPage } from '../add-plan/add-plan';
import { HelpPage } from '../help/help';

import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-careplan',
  templateUrl: 'careplan.html',
})
export class CarePlanPage {

  ddChanges: boolean = false;
  nowDragging: boolean = false;
  subs = new Subscription();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private ds: DragulaService,
    public PPP: PersonalPlansProvider) {

    // event listeners
    // save if swapped out
    // this.plt.pause.subscribe(() => {
    //   // think this fails because async takes too long?
    //   this.PPP.write();
    // });

    // dragging stuff
    // disable scroll when dragging
    document.addEventListener('touchstart', (e) => {
      if (this.nowDragging) {
        e.preventDefault();
      }
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
      // console.log('touchmove event', this.nowDragging);
      if (this.nowDragging) {
        e.preventDefault();
      }
    }, { passive: false });

    this.subs.add(this.ds.drag()
      .subscribe(({ name }) => {
        this.nowDragging = true;
        // console.log('drag event', name, this.nowDragging);
      })
    );
    this.subs.add(this.ds.dragend()
      .subscribe(({ name }) => {
        this.nowDragging = false;
        // console.log('dragend event', name, this.nowDragging);
      })
    );

    // drag/drop events
    this.subs.add(this.ds.dropModel("plan-list")
      .subscribe(({ el, targetModel }) => {
        this.nowDragging = false;
        // reassignment to this.plans.problems[] fails if not explicit,
        //    this works on both source and target when dragging from one problem to another, 
        //      without assigning source explicitly.
        //      i don't understand it but it works. (so leave it alone)
        const t = el.getElementsByClassName('planId');
        const c = parseInt(t[0].innerHTML);
        this.PPP.plans[c] = targetModel;
        this.ddChanges = true;
      })
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CareplanPage');
    // console.log('plans', this.PPP.plans);
  }
  
  ionViewDidEnter() {
    console.log('ionViewDidEnter CareplanPage');
    this.ddChanges = false;  // init/re-init on load
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave CareplanPage');
    // console.log('ddchanges', this.ddChanges);
    if (this.ddChanges) {
      this.PPP.write();
      this.ddChanges = false;  // reset after save--overkill if on exit from page
    }
    // console.log(this.subs);
  }
  
  ionViewWillUnload() {
    console.log('ionViewWillUnload CareplanPage');
    this.subs.unsubscribe();
    document.removeEventListener('touchmove', () => { });
    document.removeEventListener('touchend', () => { });
  }

  contents(plan) {
    this.navCtrl.push(ContentsPage, {
      plan: plan
    });
  }

  addPlan() {
    this.navCtrl.push(AddPlanPage, {
    });
  }

  easterEgg() {

  }

  help() {
    this.navCtrl.push(HelpPage);
  }

}


