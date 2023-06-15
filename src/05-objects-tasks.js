/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor(obj) {
    this.selectorsStorage = [obj];
  }

  element(value) {
    this.check('element');
    this.selectorsStorage.push({ selector: 'element', value });
    return this;
  }

  id(value) {
    this.check('id');
    this.selectorsStorage.push({ selector: 'id', value });
    return this;
  }

  class(value) {
    this.check('class');
    this.selectorsStorage.push({ selector: 'class', value });
    return this;
  }

  attr(value) {
    this.check('attr');
    this.selectorsStorage.push({ selector: 'attr', value });
    return this;
  }

  pseudoClass(value) {
    this.check('pseudoClass');
    this.selectorsStorage.push({ selector: 'pseudoClass', value });
    return this;
  }

  pseudoElement(value) {
    this.check('pseudoElement');
    this.selectorsStorage.push({ selector: 'pseudoElement', value });
    return this;
  }

  stringify() {
    let string = '';
    this.selectorsStorage.forEach((item) => {
      switch (item.selector) {
        case 'id':
          string += `#${item.value}`;
          break;
        case 'class':
          string += `.${item.value}`;
          break;
        case 'attr':
          string += `[${item.value}]`;
          break;
        case 'pseudoClass':
          string += `:${item.value}`;
          break;
        case 'pseudoElement':
          string += `::${item.value}`;
          break;
        default:
          string += `${item.value}`;
          break;
      }
    });
    return string;
  }

  check(selector) {
    if (selector === 'element' || selector === 'id' || selector === 'pseudoElement') {
      const isExist = this.selectorsStorage.filter((item) => item.selector === selector).length > 0;
      if (isExist) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    const selectorsOrder = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
    const lastElem = this.selectorsStorage.at(-1).selector;

    if (selectorsOrder.indexOf(selector) < selectorsOrder.indexOf(lastElem)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector({ selector: 'element', value });
  },

  id(value) {
    return new Selector({ selector: 'id', value });
  },

  class(value) {
    return new Selector({ selector: 'class', value });
  },

  attr(value) {
    return new Selector({ selector: 'attr', value });
  },

  pseudoClass(value) {
    return new Selector({ selector: 'pseudoClass', value });
  },

  pseudoElement(value) {
    return new Selector({ selector: 'pseudoElement', value });
  },

  combine(selector1, combinator, selector2) {
    return {
      selector1,
      combinator,
      selector2,
      stringify() {
        return `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
      },
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
