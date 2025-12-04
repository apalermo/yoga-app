import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionInformation } from '../../../../core/models/sessionInformation.interface';
import { SessionService } from '../../../../core/service/session.service';
import { Session } from '../../../../core/models/session.interface';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { MaterialModule } from '../../../../shared/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  private sessionApiService = inject(SessionApiService);
  private sessionService = inject(SessionService);

  public sessions$: Observable<Session[]> = of([]);

  ngOnInit() {
    this.sessions$ = this.sessionApiService.all();
  }
  get user(): SessionInformation | undefined {
    return this.sessionService.sessionInformation;
  }
}
