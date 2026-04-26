import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="navbar-brand" routerLink="/leads">
        <mat-icon>person_search</mat-icon>
        <span>Leads<b>App</b></span>
      </div>
      <span class="spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <div class="menu-user px-3 py-2">
          <small>Logado como</small>
          <p>
            <b>{{ username }}</b>
          </p>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon> Sair
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [
    `
      .navbar {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        color: white;
        cursor: pointer;
        mat-icon {
          font-size: 28px;
        }
        b {
          color: #ff4081; 
        }
        span {
          font-size: 1.3rem;
        }
      }
      .spacer {
        flex: 1;
      }
      .menu-user {
        small {
          color: #999;
          font-size: 11px;
        }
        p {
          margin: 0;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  username = this.auth.getUsername();
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  logout() {
    this.auth.logout();
  }
}
