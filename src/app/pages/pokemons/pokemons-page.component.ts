
import { ApplicationRef, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal} from '@angular/core/rxjs-interop';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonListSkeletonComponent } from "./ui/pokemon-list-skeleton/pokemon-list-skeleton.component";
import { PokemonService } from '../../pokemons/services/pokemon.service';
import { SimplePokemon } from '../../pokemons/interfaces/simple-pokemon.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemons-page',
  imports: [PokemonListComponent, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit{
  private title = inject(Title)

  private pokemonService = inject(PokemonService)
  public pokemons = signal<SimplePokemon[]>([])
  private route = inject(ActivatedRoute)
  private router = inject(Router)


  public currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('page') ?? '1'),
      map(page => (isNaN(+page) ? 1 : +page)),
      map( page => Math.max(1, page))
    )
  )
  // private appRef = inject(ApplicationRef)

  // private $appState = this.appRef.isStable.subscribe( isStable => {
  //   console.log({isStable})
  // })

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 5000)
    this.loadPokemon()

  }

  loadPokemon(page = 0){
    const pageToLoad = this.currentPage()! + page
    this.pokemonService.loadPage(pageToLoad)
    .pipe(
      tap(() => this.router.navigate([], {queryParams: {page: pageToLoad}})),
      tap(() => this.title.setTitle(`Pokemons SSR - Page ${pageToLoad}`))

    )
    .subscribe((pokemons) => {
      this.pokemons.set(pokemons)
    })


  }
  // ngOnDestroy(): void {
  //   this.$appState.unsubscribe();
  // }


 }
