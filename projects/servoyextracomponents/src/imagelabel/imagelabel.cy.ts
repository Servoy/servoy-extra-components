import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { MountConfig } from 'cypress/angular';
import { ServoyExtraImageLabel } from './imagelabel';

describe('ImageLabel Component', () => {
  const servoyApiSpy = new ServoyApiTesting();

  const config: MountConfig<|ServoyExtraImageLabel> = {
      imports: [ ServoyPublicTestingModule],
  } 

  beforeEach(() => {
      config.componentProperties = {
          servoyApi: servoyApiSpy,
          imageURL: 'https://www.servoy.com/',
      }
  });

  it('can mount', () => {
    const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
    cy.mount(ServoyExtraImageLabel, config);
    cy.get('img').invoke('attr', 'src')
    .should('eq', config.componentProperties.imageURL).then(_ => {
      expect(registerComponent).to.been.called;
    });
  })
})