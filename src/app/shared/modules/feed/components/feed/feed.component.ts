import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getFeedAction } from 'src/app/shared/modules/feed/store/actions/getFeed.action';
import { Observable, Subscription } from 'rxjs';
import { GetFeedResponseInterface } from 'src/app/shared/modules/feed/types/getFeedResponse.interface';
import {
  feedSelector,
  errorSelector,
  isLoadingSelector,
} from 'src/app/shared/modules/feed/store/selector';
import { environment } from 'src/environment/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import queryString from 'query-string';

@Component({
  selector: 'mc-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, OnDestroy, OnChanges {
  @Input('apiUrl') apiUrlProps: string;

  feed$: Observable<GetFeedResponseInterface | null>;
  error$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  limit = environment.limit;
  baseUrl: string;
  queryParamsSubscription: Subscription;
  currentPage: number;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const isApiUrlChanged =
      !changes['apiUrlProps'].firstChange &&
      changes['apiUrlProps'].currentValue !==
        changes['apiUrlProps'].previousValue;
    if (isApiUrlChanged) {
      this.fetchFeed();
    }
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  initializeValues(): void {
    this.feed$ = this.store.pipe(select(feedSelector));
    this.error$ = this.store.pipe(select(errorSelector));
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.baseUrl = this.router.url.split('?')[0];
  }

  initializeListeners(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        // Создать тип с возможными полями внутри params в вашем приложении
        // interface ParamsInterface {
        //   page?: string;
        // }
        // const typedParams = params as ParamsInterface
        // Number(params?.page || '1')
        this.currentPage = Number(params['page'] || '1');
        this.fetchFeed();
      }
    );
  }

  fetchFeed(): void {
    const offset = this.currentPage * this.limit - this.limit;
    const parsedUrl = queryString.parseUrl(this.apiUrlProps);
    const stringifiedParams = queryString.stringify({
      limit: this.limit,
      offset,
      ...parsedUrl.query,
    });
    const apiUrlWithParams = `${parsedUrl.url}?${stringifiedParams}`;
    this.store.dispatch(getFeedAction({ url: apiUrlWithParams }));
  }
}
