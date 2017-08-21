/*
 * Interstellar.js
 * https://github.com/Xaind/interstellar
 * Copyright 2017, Shane Parker; Licensed MIT
 */
package org.interstellar.model;

import java.util.List;


public class PageModel<T> {

	private List<PageElement> elements;

	public List<PageElement> getElements() {
		return elements;
	}

	public void setElements(List<PageElement> elements) {
		this.elements = elements;
	}
	
	public T getModel() {
		
		return null;
	}
	
	public void setModel(T model) {
		
	}
	
	public PageElement getElement(String name) {
		return null;
	}
}
