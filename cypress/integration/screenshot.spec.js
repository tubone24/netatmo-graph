describe('ScreenShotNetatmoDashboard', () => {
  it('TopPageWithGraphs', () => {
    cy.visit("/");
    cy.wait(10000)
    cy.get('div > span:nth-child(2) > .MuiIconButton-colorInherit:nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root').click()
    cy.viewport(1920, 1080);
    cy.screenshot('screenShot',{
      capture: 'fullPage'
    });
  });
});
