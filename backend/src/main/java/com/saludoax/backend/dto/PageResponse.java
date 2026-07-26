package com.saludoax.backend.dto;

import org.springframework.data.domain.Page;
import java.util.List;

public class PageResponse<T> {
    private List<T> contenido;
    private int paginaActual;
    private int totalPaginas;
    private long totalElementos;
    private int tamanoPagina;

    public PageResponse(Page<T> page) {
        this.contenido = page.getContent();
        this.paginaActual = page.getNumber();
        this.totalPaginas = page.getTotalPages();
        this.totalElementos = page.getTotalElements();
        this.tamanoPagina = page.getSize();
    }

    public List<T> getContenido() { return contenido; }
    public int getPaginaActual() { return paginaActual; }
    public int getTotalPaginas() { return totalPaginas; }
    public long getTotalElementos() { return totalElementos; }
    public int getTamanoPagina() { return tamanoPagina; }
}
