import * as AgendaClass from '@/models/AgendaClass';

export class AgendaItemFactory {
    static createAgendaItem(type, item, props) {
      switch (type) {
        case 'number':
          return new AgendaClass.NumberAgendaItem(item);
        case 'radio':
          return new AgendaClass.RadioAgendaItem(item);
        case 'checkbox':
          return new AgendaClass.CheckboxAgendaItem(item);
        case 'text':
          return new AgendaClass.TextAgendaItem(item, 'text', props);
        case 'textarea':
          return new AgendaClass.TextAgendaItem(item, 'textarea', props);
        case 'minMaxBest':
          return new AgendaClass.MinMaxBestAgendaItem(item);
        case 'matrix':
          return new AgendaClass.MatrixAgendaItem(item);
        case 'roulette':
          return new AgendaClass.RouletteAgendaItem(item);
        case 'radiolikert':
          return new AgendaClass.RadioLikertAgendaItem(item);
        case 'radiorich':
          return new AgendaClass.RadioRichAgendaItem(item);
        case 'workshopprobability':
          return new AgendaClass.WorkshopProbabilityAgendaItem(item);
        case 'welcome':
          return new AgendaClass.WelcomeAgendaItem(item, props);
        case 'submit':
          return new AgendaClass.SubmitAgendaItem(item, props);
        case 'locked':
          return new AgendaClass.LockedAgendaItem(item, props);
        case 'backgroundPage':
          return new AgendaClass.BackgroundAgendaItem(item);
        case 'section':
          return new AgendaClass.SectionAgendaItem(item);
        case 'table':
          return new AgendaClass.TableAgendaItem(item);
        case 'validation':
          return new AgendaClass.ValidationAgendaItem(item);
        default:
          throw new Error(`Unknown AgendaItem type: ${type}`);
      }
    }
  }
  