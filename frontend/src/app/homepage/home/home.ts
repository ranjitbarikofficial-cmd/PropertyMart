import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Body } from '../body/body';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Body, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

