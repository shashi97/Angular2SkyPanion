import { TestBed, inject } from '@angular/core/testing';

import { AttachmentComponent } from './attachment.component';

describe('a attachment component', () => {
	let component: AttachmentComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AttachmentComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AttachmentComponent], (AttachmentComponent) => {
		component = AttachmentComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});