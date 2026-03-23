describe('ATS Analyzer Upload Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should load the initial upload page correctly', () => {
    cy.contains('Analisador ATS');
    cy.contains('Upload PDF').should('exist');
    cy.contains('Colar texto').should('exist');
  });

  it('can toggle between pdf and text modes', () => {
    // Switch to text paste mode
    cy.contains('Colar texto').parent().click();
    cy.get('textarea').should('exist');

    // Switch back to upload mode
    cy.contains('Upload PDF').parent().click();
    cy.get('input[type="file"]').should('exist');
  });

  it('prevents analysis if no text or pdf is uploaded', () => {
    cy.contains('Colar texto').parent().click();
    cy.get('textarea').clear();
    cy.contains('Gerar').click();
    cy.contains('Cole o texto do currículo').should('exist');
  });
});
