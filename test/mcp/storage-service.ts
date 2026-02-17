/**
 * Storage Service Tests
 */

import {describe, it, beforeEach} from 'mocha';
import {expect} from 'chai';
import {StorageService} from '../../src/mcp/services/storage/storage-service';

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    storageService = new StorageService();
  });

  describe('getTemplates', () => {
    it('should return avatar templates', async () => {
      const templates = await storageService.getTemplates();
      expect(templates).to.be.an('array');
      expect(templates.length).to.be.greaterThan(0);
      expect(templates[0]).to.have.property('id');
      expect(templates[0]).to.have.property('name');
      expect(templates[0]).to.have.property('style');
    });
  });

  describe('getStyles', () => {
    it('should return available styles', async () => {
      const styles = await storageService.getStyles();
      expect(styles).to.be.an('array');
      expect(styles.length).to.be.greaterThan(0);
      expect(styles[0]).to.have.property('id');
      expect(styles[0]).to.have.property('name');
    });
  });

  describe('getAssets', () => {
    it('should return all assets', async () => {
      const assets = await storageService.getAssets();
      expect(assets).to.be.an('array');
      expect(assets.length).to.be.greaterThan(0);
    });

    it('should filter assets by type', async () => {
      const hairAssets = await storageService.getAssets('hair');
      hairAssets.forEach(asset => {
        expect(asset.type).to.equal('hair');
      });
    });
  });

  describe('getTemplateById', () => {
    it('should return template by id', async () => {
      const template = await storageService.getTemplateById(
        'template-professional'
      );
      expect(template).to.not.be.undefined;
      expect(template?.name).to.equal('Professional Headshot');
    });

    it('should return undefined for non-existent template', async () => {
      const template = await storageService.getTemplateById('non-existent');
      expect(template).to.be.undefined;
    });
  });
});
