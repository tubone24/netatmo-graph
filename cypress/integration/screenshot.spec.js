describe('ScreenShotNetatmoDashboard', () => {
  it('TopPageWithGraphs', () => {
    cy.viewport(4096, 2160);
    cy.visit("/");
    cy.wait(10000)
    cy.get('div > span:nth-child(2) > .MuiIconButton-colorInherit:nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root').click()
    cy.screenshot('screenShot',{
      capture: 'fullPage'
    });
  });
});
