import { Body, Controller, Post, UseGuards, Request, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {Programme,Action,AppAbility,CheckPolicies,PoliciesGuard, PoliciesGuardEx,ProgrammeDto,ProgrammeService,
  QueryDto,ConstantUpdateDto,ApiKeyJwtAuthGuard,NDCActionDto,JwtAuthGuard,ProgrammeDocumentDto,DocumentAction,ProgrammeAuth,ProgrammeIssue,ProgrammeReject,
  InvestmentRequestDto,Investment,InvestmentApprove,InvestmentCancel,InvestmentReject,NDCActionViewEntity,ProgrammeDocumentViewEntity, ProgrammeMitigationIssue} from "@undp/carbon-services-lib";



@ApiTags('Programme')
@ApiBearerAuth()
@Controller('programme')
export class ProgrammeController {

    constructor(private programmeService: ProgrammeService) {

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Programme))
    @Post('create')
    async addProgramme(@Body()programme: ProgrammeDto, @Request() req) {
      global.baseUrl = `${req.protocol}://${req.get("Host")}`;
      return this.programmeService.create(programme, req.user) 
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Programme))
    @Post('addNDCAction')
    async addNDCAction(@Body()ndcAction: NDCActionDto, @Request() req) {
      global.baseUrl = `${req.protocol}://${req.get("Host")}`;
      return this.programmeService.addNDCAction(ndcAction, req.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DocumentAction))
    @Post('addDocument')
    async addDocument(@Body()docDto: ProgrammeDocumentDto, @Request() req) {
      global.baseUrl = `${req.protocol}://${req.get("Host")}`;
      return this.programmeService.addDocument(docDto, req.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DocumentAction))
    @Post('docAction')
    async docAction(@Body()docAction: DocumentAction, @Request() req) {
      return this.programmeService.docAction(docAction, req.user)
    }


    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Read, Programme, true))
    // @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, User, true))
    @Post('query')
    async getAll(@Body()query: QueryDto, @Request() req) {
      return this.programmeService.query(query, req.abilityCondition)
    }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Read, ProgrammeDocumentViewEntity, true))
    // @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, User, true))
    @Post('queryDocs')
    async queryDocuments(@Body()query: QueryDto, @Request() req) {
      return this.programmeService.queryDocuments(query, req.abilityCondition)
    }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Read, NDCActionViewEntity, true))
    // @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, User, true))
    @Post('queryNdcActions')
    async queryNdcActions(@Body()query: QueryDto, @Request() req) {
      return this.programmeService.queryNdcActions(query, req.abilityCondition)
    }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Read, NDCActionViewEntity, true))
    @Post('queryNdcDetails')
    async queryNdcDetails(@Body()query: QueryDto, @Request() req) {
      return this.programmeService.queryNdcDetails(query, req.abilityCondition)
    }

    // @ApiBearerAuth('api_key')
    // @ApiBearerAuth()
    // @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuard)
    // @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Read, Programme, true))
    // @Get('getHistory')
    // async getHistory(@Query('programmeId') programmeId: string, @Request() req) {
    //     return this.programmeService.getProgrammeEvents(programmeId, req.user)
    // }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Update, Programme))
    @Post('updateConfigs')
    async updateConfigs(@Body() config: ConstantUpdateDto) {
        return this.programmeService.updateCustomConstants(config.type, config);
    }

    @ApiBearerAuth('api_key')
    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Update, Programme))
    @Put('authProgramme')
    async authProgramme(@Body() auth: ProgrammeAuth) {
        return this.programmeService.authProgramme(auth);
    }

    @ApiBearerAuth('api_key')
    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Update, Programme))
    @Put('issueCredit')
    async issueCredit(@Body() issue: ProgrammeMitigationIssue,@Request() req) {
        return this.programmeService.issueCredit(issue,req.abilityCondition);
    }

    @ApiBearerAuth('api_key')
    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Update, Programme))
    @Put('rejectProgramme')
    async rejectProgramme(@Body() rej: ProgrammeReject) {
        return this.programmeService.rejectProgramme(rej,undefined);
    }


    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Update, Investment))
    @Post('addInvestment')
    async addInvestment(@Body() investment: InvestmentRequestDto, @Request() req) {
        return this.programmeService.addInvestment(investment, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Create, Investment))
    @Post('investmentApprove')
    async investmentApprove(@Body() body: InvestmentApprove, @Request() req) {
        return this.programmeService.investmentApprove(body, req.user)
    }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Delete, Investment))
    @Post('investmentReject')
    async investmentReject(@Body() body: InvestmentReject, @Request() req) {
        return this.programmeService.investmentReject(body, req.user)
    }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Delete, Investment))
    @Post('investmentCancel')
    async investmentCancel(@Body() body: InvestmentCancel, @Request() req) {
        return this.programmeService.investmentCancel(body, req.user)
    }

    @ApiBearerAuth()
    @UseGuards(ApiKeyJwtAuthGuard, PoliciesGuardEx(true, Action.Read, Investment, true))
    @Post('investmentQuery')
    queryUser(@Body()query: QueryDto, @Request() req) {
      console.log(req.abilityCondition)
      return this.programmeService.queryInvestment(query, req.abilityCondition, req.user)
    }
}