import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function getTemplate(){
  let text;

  if(document.getElementById('filter-everything').checked){
    text = 'Click New Event to create your first point';
  } else if(document.getElementById('filter-future').checked){
    text = 'There are no future events now';
  } else if(document.getElementById('filter-past').checked){
    text = 'There are no past events now';
  } else if(document.getElementById('filter-present').checked){
    text = 'There are no present events now';
  }

  return `<section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>

          <p class="trip-events__msg">${text}</p>

          <!--
            Значение отображаемого текста зависит от выбранного фильтра:
              * Everything – 'Click New Event to create your first point'
              * Past — 'There are no past events now';
              * Present — 'There are no present events now';
              * Future — 'There are no future events now'.
          -->
        </section>`;
}

export default class createSuggestionMessage extends AbstractStatefulView{
  get template(){
    return getTemplate();
  }
}
