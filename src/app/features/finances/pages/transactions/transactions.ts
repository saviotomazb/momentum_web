import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  Calendar,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  House,
  Landmark,
  LucideAngularModule,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  Trash2,
  Utensils,
  WalletCards,
  type LucideIconData,
} from 'lucide-angular';

interface TransactionSummary {
  label: string;
  value: string;
  hint: string;
  icon: LucideIconData;
  tone: 'success' | 'error' | 'info' | 'accent';
}

interface TransactionItem {
  description: string;

  category: {
    name: string;
    color: string;
    icon: LucideIconData;
  };

  type: 'Receita' | 'Despesa';

  value: number;

  date: string;

  paymentMethod: {
    label: string;
    icon: LucideIconData;
  };
}

@Component({
  selector: 'app-finance-transactions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './transactions.html',
})
export class TransactionsComponent {
  protected readonly icons = {
    calendar: Calendar,
    chevronDown: ChevronDown,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronsLeft: ChevronsLeft,
    chevronsRight: ChevronsRight,
    pencil: Pencil,
    plus: Plus,
    search: Search,
    trash: Trash2,
  };

  protected readonly summaries: TransactionSummary[] = [
    {
      label: 'Receitas',
      value: 'R$ 5.000,00',
      hint: 'Este mês',
      icon: ArrowUp,
      tone: 'success',
    },
    {
      label: 'Despesas',
      value: 'R$ 2.800,00',
      hint: 'Este mês',
      icon: ArrowDown,
      tone: 'error',
    },
    {
      label: 'Saldo',
      value: 'R$ 2.200,00',
      hint: 'Este mês',
      icon: WalletCards,
      tone: 'info',
    },
    {
      label: 'Total de transações',
      value: '42',
      hint: 'Este mês',
      icon: ReceiptText,
      tone: 'accent',
    },
  ];

  protected readonly transactions: TransactionItem[] = [
    {
      description: 'Almoço no restaurante',
      category: {
        name: 'Alimentação',
        color: '#22C55E',
        icon: Utensils,
      },
      type: 'Despesa',
      value: 35.5,
      date: '10/08/2026',
      paymentMethod: {
        label: 'Cartão de Débito',
        icon: CreditCard,
      },
    },
    {
      description: 'Combustível',
      category: {
        name: 'Transporte',
        color: '#3B82F6',
        icon: Car,
      },
      type: 'Despesa',
      value: 120,
      date: '09/08/2026',
      paymentMethod: {
        label: 'Cartão de Crédito',
        icon: CreditCard,
      },
    },
    {
      description: 'Salário',
      category: {
        name: 'Trabalho',
        color: '#10B981',
        icon: BriefcaseBusiness,
      },
      type: 'Receita',
      value: 5000,
      date: '05/08/2026',
      paymentMethod: {
        label: 'Conta Bancária',
        icon: Landmark,
      },
    },
    {
      description: 'Supermercado',
      category: {
        name: 'Alimentação',
        color: '#22C55E',
        icon: ShoppingCart,
      },
      type: 'Despesa',
      value: 86.3,
      date: '04/08/2026',
      paymentMethod: {
        label: 'Cartão de Débito',
        icon: CreditCard,
      },
    },
    {
      description: 'Aluguel',
      category: {
        name: 'Moradia',
        color: '#F59E0B',
        icon: House,
      },
      type: 'Despesa',
      value: 900,
      date: '01/08/2026',
      paymentMethod: {
        label: 'Transferência',
        icon: Landmark,
      },
    },
  ];

  protected readonly pageItems: Array<number | 'ellipsis'> = [
    1,
    2,
    3,
    'ellipsis',
    9,
  ];

  protected summaryToneClasses(
    tone: TransactionSummary['tone'],
  ): string {
    const classes = {
      success: 'bg-success/15 text-success border-success/20',
      error: 'bg-error/15 text-error border-error/20',
      info: 'bg-info/15 text-info border-info/20',
      accent: 'bg-primary/15 text-accent border-primary/20',
    };

    return classes[tone];
  }

  protected typeIcon(
    type: TransactionItem['type'],
  ): LucideIconData {
    return type === 'Receita' ? ArrowUp : ArrowDown;
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}