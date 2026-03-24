# Mobile Card Spacing Design

**Goal:** Make the mobile trip builder feel more compact by trimming stacked horizontal padding without changing desktop spacing.

## Problem

On small screens the selected segment card feels oversized because multiple horizontal gutters stack together:

- the page content wrapper adds mobile side padding
- the itinerary list adds another layer of mobile padding
- each segment card adds a larger internal mobile padding

This leaves the card content visually narrow and makes the card feel heavier than intended.

## Chosen Approach

Use a balanced mobile-only spacing reduction across both the itinerary container and the segment card:

- reduce the main page mobile gutter slightly
- reduce the itinerary list mobile gutter slightly
- reduce the segment card mobile internal padding slightly
- keep `sm` and desktop spacing unchanged or effectively unchanged

## Why This Approach

Adjusting only the outer gutter would still leave the card interior feeling bulky. Adjusting only the card padding would still keep the whole column inset too far from the viewport edges. A small reduction at both layers preserves breathing room while making the card feel appropriately sized on narrow screens.

## Validation

- add a regression test for the card's compact mobile padding classes
- add a regression test for the itinerary list mobile gutter classes
- run the focused Vitest suite covering the page shell and day card
