import { Component, OnInit, Input } from '@angular/core';
import { JobCategory } from './shared/jobs.model';

@Component({
  selector: 'sp-job-category',
   templateUrl: './jobCategories.component.html'
})
export class JobCategoryComponent implements OnInit {
  @Input() jobCategories: Array<JobCategory>;


  public get jobCategoriesItem(): Array<JobCategory> {
    return this.jobCategories;
  }
  ngOnInit(): void {
    console.log(this.jobCategoriesItem);
  }
  constructor() {
    console.log(this.jobCategoriesItem);
  }
}
