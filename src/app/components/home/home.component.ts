import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FEATURED_DISHES, formatDateOffset } from '../../data/initial-data';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  headline = 'Your Table, Your Moment.';
  tagline = 'Immerse in contemporary culinary mastery. Reserve your bespoke dining table with live spatial floor planning and instant confirmation.';

  quickDate: string = formatDateOffset(0);
  quickTime: string = '19:30';
  quickGuests: number = 2;

  dishes: Dish[] = FEATURED_DISHES;

  highlights = [
    { number: '12', label: 'Bespoke Dining Tables', icon: 'fa-table-cells' },
    { number: '4', label: 'Curated Ambiance Zones', icon: 'fa-compass' },
    { number: '90m', label: 'Anti-Conflict Buffer', icon: 'fa-shield-halved' },
    { number: '4.9★', label: 'Guest Gastronomy Score', icon: 'fa-star' }
  ];

  zones = [
    {
      title: 'Main Dining Room',
      subtitle: 'Fireplace & Open Kitchen',
      description: 'Intimate candlelit seating surrounding our open exhibition hearth and central chandelier.',
      capacity: '2 to 4 Guests',
      features: ['Acoustic booth seating', 'Full kitchen sightline', 'Plush velvet banquettes'],
      icon: 'fa-fire-burner'
    },
    {
      title: 'Garden Terrace',
      subtitle: 'Verdant Pergola & Fountain',
      description: 'Dine al fresco beneath blossoming wisteria and glowing fairy lights with radiant heaters.',
      capacity: '2 to 6 Guests',
      features: ['Fountain backdrop', 'All-weather heaters', 'Romantic evening ambiance'],
      icon: 'fa-tree'
    },
    {
      title: 'Executive VIP Lounge',
      subtitle: 'Private Salons & Chef Table',
      description: 'Ultra-exclusive sanctuary offering bespoke multi-course tasting menus and dedicated sommeliers.',
      capacity: '8 to 10 Guests',
      features: ['Private wine cellar access', 'Sound isolation', 'Dedicated service team'],
      icon: 'fa-crown'
    },
    {
      title: 'Bar & Lounge',
      subtitle: 'Artisanal Cocktails & High-Tops',
      description: 'Vibrant and energetic space for craft pairings, small plates, and casual conversations.',
      capacity: '2 to 6 Guests',
      features: ['Bespoke mixology bar', 'Lounge sofas', 'Curated vinyl playlist'],
      icon: 'fa-martini-glass-citrus'
    }
  ];

  constructor(private router: Router) {}

  jumpToBooking(): void {
    this.router.navigate(['/book'], {
      queryParams: {
        date: this.quickDate,
        time: this.quickTime,
        guests: this.quickGuests
      }
    });
  }
}
