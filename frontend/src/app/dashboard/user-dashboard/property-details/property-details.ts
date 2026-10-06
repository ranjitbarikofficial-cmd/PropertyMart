import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../../services/property';

@Component({
  selector: 'app-property-details',
  imports: [],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css',
})
export class PropertyDetails implements OnInit {

  property: any;

  constructor(
    private route: ActivatedRoute,
    private propertyservice: Property,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.propertyservice.getPropertyById(id).subscribe({
      next: (data) => {
        this.property = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Property details error:', error);
      }
    });
  }
}