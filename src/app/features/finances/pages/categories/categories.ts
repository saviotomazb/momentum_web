import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import {
  BriefcaseBusiness,
  Car,
  ChevronLeft,
  ChevronRight,
  House,
  Lightbulb,
  LucideAngularModule,
  Pencil,
  Plus,
  Shapes,
  ShoppingBasket,
  Trash2,
  Utensils,
  type LucideIconData,
} from 'lucide-angular';

interface FinanceCategory {
  name: string;
  icon: LucideIconData;
  color: string;
  total: number;
  type: 'Receita' | 'Despesa';
}

interface CategoryTip {
  title: string;
  description: string;
}

@Component({
  selector: 'app-finance-categories',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './categories.html',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private tipIntervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly icons = {
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    lightbulb: Lightbulb,
    pencil: Pencil,
    plus: Plus,
    trash: Trash2,
  };

  protected readonly currentTipIndex = signal(0);

  protected readonly categories: FinanceCategory[] = [
    {
      name: 'Alimentacao',
      icon: Utensils,
      color: '#22C55E',
      total: 980,
      type: 'Despesa',
    },
    {
      name: 'Transporte',
      icon: Car,
      color: '#3B82F6',
      total: 560,
      type: 'Despesa',
    },
    {
      name: 'Moradia',
      icon: House,
      color: '#F59E0B',
      total: 900,
      type: 'Despesa',
    },
    {
      name: 'Saude',
      icon: Shapes,
      color: '#A855F7',
      total: 280,
      type: 'Despesa',
    },
    {
      name: 'Lazer',
      icon: ShoppingBasket,
      color: '#EC4899',
      total: 210,
      type: 'Despesa',
    },
    {
      name: 'Trabalho',
      icon: BriefcaseBusiness,
      color: '#10B981',
      total: 5000,
      type: 'Receita',
    },
    {
      name: 'Outros',
      icon: Shapes,
      color: '#64748B',
      total: 280,
      type: 'Despesa',
    },
  ];

  protected readonly tips: CategoryTip[] = [
    {
      title: 'Agrupe com clareza',
      description:
        'Use nomes simples para enxergar rapidamente para onde cada transacao deve ir.',
    },
    {
      title: 'Revise recorrentes',
      description:
        'Assinaturas e contas fixas ficam mais faceis de acompanhar quando usam sempre a mesma categoria.',
    },
    {
      title: 'Compare tendencias',
      description:
        'Olhe suas categorias ao longo do mes para perceber excessos antes do fechamento.',
    },
    {
      title: 'Mantenha enxuto',
      description:
        'Categorias demais dificultam a leitura. Una itens parecidos quando fizer sentido.',
    },
  ];

  protected readonly currentTip = computed(() => this.tips[this.currentTipIndex()]);

  ngOnInit(): void {
    this.startTipRotation();
  }

  ngOnDestroy(): void {
    if (this.tipIntervalId) {
      clearInterval(this.tipIntervalId);
    }
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  protected previousTip(): void {
    this.currentTipIndex.update((index) => (index === 0 ? this.tips.length - 1 : index - 1));
    this.restartTipRotation();
  }

  protected nextTip(): void {
    this.currentTipIndex.update((index) => (index + 1) % this.tips.length);
    this.restartTipRotation();
  }

  private startTipRotation(): void {
    this.tipIntervalId = setInterval(() => {
      this.currentTipIndex.update((index) => (index + 1) % this.tips.length);
    }, 10000);
  }

  private restartTipRotation(): void {
    if (this.tipIntervalId) {
      clearInterval(this.tipIntervalId);
    }

    this.startTipRotation();
  }
}
